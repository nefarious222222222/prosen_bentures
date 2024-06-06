<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header('Content-Type: application/json');

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $shopId = $_GET['shopId'];

        $sql = "SELECT uo.*, pi.productName, pi.productFlavor, pi.productImage, si.shopName
                FROM user_order uo
                INNER JOIN product_info pi ON uo.productID = pi.productID
                INNER JOIN shop_info si ON pi.shopID = si.shopID
                WHERE si.shopID = :shopId
                ORDER BY uo.orderDate";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':shopId', $shopId);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($orders) {
            echo json_encode($orders);
        } else {
            $response = ["status" => 0, "message" => "No orders found for the specified account"];
            echo json_encode($response);
        }
        break;

    case 'POST':
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (isset($data['orderId']) && isset($data['status'])) {
            $orderId = $data['orderId'];
            $status = $data['status'];

            $sql = "UPDATE user_order SET status = :status WHERE orderID = :orderId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':orderId', $orderId);

            if ($stmt->execute()) {
                $response = ["status" => 1, "message" => $status == "to receive" ? "Order status updated successfully" : "Order cancellation has been confirmed"];
            } else {
                $response = ["status" => 0, "message" => "Failed to update order status"];
            }
        } else {
            $response = ["status" => 0, "message" => "Invalid input"];
        }
        echo json_encode($response);
        break;

    case 'PUT':
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (isset($data['priceId']) && isset($data['productQuantity'])) {
            $priceID = $data['priceId'];
            $productQuantity = $data['productQuantity'];

            $sql = "SELECT productStock FROM product_price WHERE priceID = :priceId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':priceId', $priceID);
            $stmt->execute();
            $currentStock = $stmt->fetch(PDO::FETCH_ASSOC)['productStock'];

            if ($currentStock !== false) {
                $newStock = $currentStock - $productQuantity;

                if ($newStock >= 0) {
                    $updateSql = "UPDATE product_price SET productStock = :newStock WHERE priceID = :priceId";
                    $updateStmt = $conn->prepare($updateSql);
                    $updateStmt->bindParam(':newStock', $newStock);
                    $updateStmt->bindParam(':priceId', $priceID);

                    if ($updateStmt->execute()) {
                        $response = ["status" => 1, "message" => "Product stock updated successfully"];
                    } else {
                        $response = ["status" => 0, "message" => "Failed to update product stock"];
                    }
                } else {
                    $response = ["status" => 0, "message" => "Insufficient stock"];
                }
            } else {
                $response = ["status" => 0, "message" => "Product not found"];
            }
        } else {
            $response = ["status" => 0, "message" => "Invalid input"];
        }
        echo json_encode($response);
        break;

    default:
        $response = ["status" => 0, "message" => "Invalid request method"];
        echo json_encode($response);
        break;
}
?>
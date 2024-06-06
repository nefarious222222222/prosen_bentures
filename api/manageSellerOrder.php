<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
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

            if ($stmt->execute() && $status == "to receive") {
                $response = ["status" => 1, "message" => "Order status updated successfully"];
            } elseif ($stmt->execute() && $status == "order cancelled") {
                $response = ["status" => 1, "message" => "Order cancellation has been confirmed"];
            } else {
                $response = ["status" => 0, "message" => "Failed to update order status"];
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
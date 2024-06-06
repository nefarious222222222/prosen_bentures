<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $orderInfo = json_decode(file_get_contents('php://input'));

    $requiredFields = ['accountId', 'productId', 'priceId', 'quantity', 'totalPrice', 'shippingMode', 'orderDate', 'receiveDate', 'status'];
    foreach ($requiredFields as $field) {
        if (empty($orderInfo->$field)) {
            $response = ["status" => 0, "message" => "Something went wrong"];
            echo json_encode($response);
            exit();
        }
    }

    $sql = "INSERT INTO user_order (orderID, accountID, productID, shopID, priceID, quantity, totalPrice, shippingMode, orderDate, receiveDate, status) 
            VALUES (null, :accountId, :productId, :shopId, :priceId, :quantity, :totalPrice, :shippingMode, :orderDate, :receiveDate, :status)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':accountId', $orderInfo->accountId);
    $stmt->bindParam(':productId', $orderInfo->productId);
    $stmt->bindParam(':shopId', $orderInfo->shopId);
    $stmt->bindParam(':priceId', $orderInfo->priceId);
    $stmt->bindParam(':quantity', $orderInfo->quantity);
    $stmt->bindParam(':totalPrice', $orderInfo->totalPrice);
    $stmt->bindParam(':shippingMode', $orderInfo->shippingMode);
    $stmt->bindParam(':orderDate', $orderInfo->orderDate);
    $stmt->bindParam(':receiveDate', $orderInfo->receiveDate);
    $stmt->bindParam(':status', $orderInfo->status);

    if ($stmt->execute()) {
        $response = ["status" => 1, "message" => "Order has been placed successfully"];
    } else {
        $response = ["status" => 0, "message" => "Failed to place order"];
    }

    echo json_encode($response);
}
?>
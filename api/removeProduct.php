<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $productId = $_GET['productId'];

        $sql = "UPDATE product_info SET status = '0' WHERE productID = :productId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();

        $rowCount = $stmt->rowCount();
        if ($rowCount > 0) {
            $response = ["status" => 1, "message" => "Product removed successfully"];
        } else {
            $response = ["status" => 0, "message" => "Failed to remove product"];
        }
        echo json_encode($response);
        break;
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $productId = $_GET['productId'];

        $sql = "SELECT 
                    pi.*, 
                    si.shopName,
                    si.shopLogo
                FROM 
                    product_info pi
                LEFT JOIN 
                    shop_info si ON pi.shopID = si.shopID
                WHERE 
                    pi.productID = :productId";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $productData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($productData) {
            echo json_encode($productData);
        } else {
            $response = ["status" => 0, "message" => "Product not found"];
            echo json_encode($response);
        }
        break;
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $shopId = $_GET['shopId'];
        $userRole = $_GET['userRole'];

        $productStockThreshold = 0;
        if ($userRole == 'retailer') {
            $productStockThreshold = 20;
        } elseif ($userRole == 'distributor') {
            $productStockThreshold = 50;
        } elseif ($userRole == 'manufacturer') {
            $productStockThreshold = 100;
        }

        $sql = "SELECT 
                    pi.productID,
                    pi.shopID,
                    pi.productName,
                    pi.productFlavor,
                    pi.productImage,
                    pp.priceID,
                    pp.productSize,
                    pp.productStock
                FROM 
                    product_info pi
                LEFT JOIN 
                    product_price pp ON pi.productID = pp.productID
                WHERE
                    pi.shopID = :shopId AND pi.status = 1 AND pp.productStock <= :productStockThreshold
                ORDER BY 
                    pp.productStock ASC, pi.productID;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':shopId', $shopId, PDO::PARAM_INT);
        $stmt->bindParam(':productStockThreshold', $productStockThreshold, PDO::PARAM_INT);
        $stmt->execute();
        $userData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($userData) {
            echo json_encode($userData);
        } else {
            $response = ["status" => 0, "message" => "No low stock products found"];
            echo json_encode($response);
        }
        break;
}
?>
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
        $status = $_GET['status'];

        $sql = "SELECT 
                    pi.*,
                    pp.priceID,
                    pp.productPrice,
                    pp.productStock,
                    COALESCE(SUM(pp.productStock), 0) AS totalStock
                FROM 
                    product_info pi
                LEFT JOIN 
                    product_price pp ON pi.productID = pp.productID
                WHERE
                    pi.shopID = :shopId AND pi.status = :status
                GROUP BY
                    pi.productID";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':shopId', $shopId);
        $stmt->bindParam(':status', $status);
        $stmt->execute();

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($products);
        break;
}
?>
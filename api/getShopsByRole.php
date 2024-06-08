<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$shopType = isset($_GET['shopType']) ? $_GET['shopType'] : '';

if (!empty($shopType)) {
    $sql = "SELECT 
                si.*, 
                COUNT(DISTINCT pi.productID) as productCount
            FROM 
                shop_info si
            JOIN 
                product_info pi
            ON 
                si.shopID = pi.shopID 
            JOIN 
                product_price pp
            ON 
                pi.productID = pp.productID
            WHERE 
                si.isVerified = 1 
            AND 
                si.status = 1 
            AND 
                si.shopType = :shopType
            AND
                pi.status = 1
            GROUP BY 
                si.shopID";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':shopType', $shopType);
    $stmt->execute();

    $shops = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($shops);
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid shop type']);
}
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$shopID = isset($_GET['shopID']) ? $_GET['shopID'] : '';

if (!empty($shopID)) {
    $sql = "SELECT 
                pi.productID,
                pi.productBrand,
                pi.productName,
                pi.productImage,
                pi.productFlavor,
                pi.status, 
                pp.priceID,
                pp.productSize,
                pp.productPrice,
                pp.productStock,
                COALESCE(SUM(pp.productStock), 0) AS totalStock
            FROM 
                product_info pi
            JOIN 
                product_price pp 
            ON 
                pi.productID = pp.productID 
            WHERE 
                pi.shopID = :shopID 
            AND 
                pi.status = 1";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':shopID', $shopID);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid shop ID']);
}
?>
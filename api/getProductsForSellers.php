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
                pp.productStock
            FROM 
                product_info pi
            LEFT JOIN 
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

    if ($products) {
        echo json_encode($products);
    } else {
        echo json_encode(['status' => 0, 'message' => 'No products found for the provided shop ID']);
    }
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid shop ID']);
}
?>
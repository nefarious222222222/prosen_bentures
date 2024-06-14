<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$shopType = isset($_GET['shopType']) ? $_GET['shopType'] : '';

if (!empty($shopType)) {
    $sql = "SELECT 
                pi.productID,
                pi.productBrand,
                pi.productName,
                pi.productImage,
                pi.productFlavor,
                pi.productAllergen,
                pi.status,
                pp.priceID,
                pp.productSize,
                pp.productPrice,
                pp.productStock,
                si.shopName,
                COALESCE(SUM(pp.productStock), 0) AS totalStock,
                COALESCE(ROUND(AVG(pr.rating), 1), 0) AS averageRating
            FROM 
                product_info pi
            JOIN 
                shop_info si ON pi.shopID = si.shopID
            LEFT JOIN
                product_price pp ON pi.productID = pp.productID
            LEFT JOIN
                product_review pr ON pi.productID = pr.productID
            WHERE 
                si.shopType = :shopType
                AND pi.status = '1'
                AND pp.priceID IS NOT NULL
            GROUP BY
                pi.productID
            ORDER BY 
                RAND()";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':shopType', $shopType);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid shop type']);
}
?>
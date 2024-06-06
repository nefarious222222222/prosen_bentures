<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        if (isset($data->shopID) && isset($data->productID) && isset($data->productName) && isset($data->productFlavor) && isset($data->productDescription)) {
            $shopID = $data->shopID;
            $productId = $data->productID;
            $productName = $data->productName;
            $productFlavor = $data->productFlavor;
            $productDescription = $data->productDescription;

            if (empty($shopID) || empty($productId) || empty($productName) || empty($productDescription) || empty($productFlavor)) {
                $response = ["status" => 0, "message" => "All fields are required"];
            } else {
                $sql = "UPDATE product_info SET productName = :productName, productFlavor = :productFlavor, productDescription = :productDescription WHERE productID = :productId AND shopID = :shopId";
                $stmt = $conn->prepare($sql);

                $stmt->bindParam(':productId', $productId);
                $stmt->bindParam(':shopId', $shopID);
                $stmt->bindParam(':productName', $productName);
                $stmt->bindParam(':productFlavor', $productFlavor);
                $stmt->bindParam(':productDescription', $productDescription);

                if ($stmt->execute()) {
                    $rowCount = $stmt->rowCount();
                    if ($rowCount > 0) {
                        $response = ["status" => 1, "message" => "Product updated successfully"];
                    } else {
                        $response = ["status" => 0, "message" => "No changes made to the product"];
                    }
                } else {
                    $response = ["status" => 0, "message" => "Failed to update product"];
                }
            }
        } else {
            $response = ["status" => 0, "message" => "Invalid input"];
        }
        echo json_encode($response);
        break;

    case 'GET':
        $shopId = $_GET['shopId'];
        $status = $_GET['status'];

        $sql = "SELECT * FROM 
                    product_info
                WHERE
                    shopID = :shopId AND status = :status
                GROUP BY
                    productID";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':shopId', $shopId);
        $stmt->bindParam(':status', $status);
        $stmt->execute();

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($products);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => 0, "message" => "Method not allowed"]);
        break;
}
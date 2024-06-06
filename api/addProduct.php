<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['shopID'], $data['productName'], $data['productDescription'], $data['productImage'], $data['productFlavor'])) {
            $shopID = $data['shopID'];
            $productName = $data['productName'];
            $productDescription = $data['productDescription'];
            $productImage = $data['productImage'];
            $productFlavor = $data['productFlavor'];

            if (empty($shopID) || empty($productName) || empty($productDescription) || empty($productImage) || empty($productFlavor)) {
                $response = ['status' => 0, 'message' => 'All fields are required.'];
            } else {
                $sql = "INSERT INTO product_Info (productID, shopID, productName, productDescription, productImage, productFlavor, dateAdded, status) 
                        VALUES (null, :shopID, :productName, :productDescription, :productImage, :productFlavor, CURRENT_TIMESTAMP, '1')";
                $stmt = $conn->prepare($sql);
                
                $stmt->bindParam(':shopID', $shopID);
                $stmt->bindParam(':productName', $productName);
                $stmt->bindParam(':productDescription', $productDescription);
                $stmt->bindParam(':productImage', $productImage);
                $stmt->bindParam(':productFlavor', $productFlavor);

                if ($stmt->execute()) {
                    $response = ['status' => 1, 'message' => 'Product added successfully.'];
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to add product.'];
                }
            }
        } else {
            $response = ['status' => 0, 'message' => 'Invalid input.'];
        }
        
        echo json_encode($response);
        break;
}
?>
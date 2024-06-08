<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $productId = $_GET['productId'];

        $sql = "SELECT 
                    priceID, 
                    productID, 
                    shopID, 
                    productSize, 
                    productPrice, 
                    productStock
                FROM 
                    product_price
                WHERE 
                    productID = :productId";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $productPriceData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($productPriceData) {
            echo json_encode($productPriceData);
        } else {
            $response = ["status" => 0, "message" => "No price details found for the given product"];
            echo json_encode($response);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $productSize = strtolower($data['productSize']);
        $productPrice = $data['productPrice'];
        $productStock = $data['productStock'];
        $shopId = $data['shopId'];
        $productId = $data['productId'];

        function reformatSize($size)
        {
            if (preg_match('/^(\d+(\.\d+)?)([a-zA-Z]+)$/', $size, $matches)) {
                $number = $matches[1];
                $unit = ucfirst($matches[3]);
                return $number . $unit;
            }
            return $size;
        }

        if (!preg_match('/oz$/i', $productSize)) {
            $response = ["status" => 0, "message" => "Product size must end with 'Oz'"];
            echo json_encode($response);
            exit;
        }

        $formattedSize = reformatSize($productSize);

        $checkSql = "SELECT COUNT(*) FROM product_price WHERE productID = :productId AND shopID = :shopId AND productSize = :productSize";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':productId', $productId);
        $checkStmt->bindParam(':shopId', $shopId);
        $checkStmt->bindParam(':productSize', $formattedSize);
        $checkStmt->execute();
        $sizeExists = $checkStmt->fetchColumn();

        if ($sizeExists > 0) {
            $response = ["status" => 0, "message" => "Size already exists"];
            echo json_encode($response);
        } else {
            $sql = "INSERT INTO product_price (productID, shopID, productSize, productPrice, productStock) 
                        VALUES (:productId, :shopId, :productSize, :productPrice, :productStock)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':productId', $productId);
            $stmt->bindParam(':shopId', $shopId);
            $stmt->bindParam(':productSize', $formattedSize);
            $stmt->bindParam(':productPrice', $productPrice);
            $stmt->bindParam(':productStock', $productStock);

            if ($stmt->execute()) {
                $response = ["status" => 1, "message" => "Successfully inserted a new size, price and stock"];
                echo json_encode($response);
            } else {
                $response = ["status" => 0, "message" => "Failed to insert new size, price and stock"];
                echo json_encode($response);
            }
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $priceID = $data['priceID'];
        $newPrice = $data['newPrice'];

        $sql = "UPDATE product_price SET productPrice = :newPrice WHERE productID = :productId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':newPrice', $newPrice);
        $stmt->bindParam(':priceID', $priceID);

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "Successfully updated price"];
            echo json_encode($response);
        } else {
            $response = ["status" => 0, "message" => "Failed to update price"];
            echo json_encode($response);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $priceID = $data['priceID'];

        if ($priceID) {
            $sql = "DELETE FROM product_price WHERE priceID = :priceID";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':priceID', $priceID);

            if ($stmt->execute()) {
                $response = ["status" => 1, "message" => "Successfully deleted size, price and stock"];
                echo json_encode($response);
            } else {
                $response = ["status" => 0, "message" => "Failed to delete size, price and stock"];
                echo json_encode($response);
            }
        } else {
            $response = ["status" => 0, "message" => "Price ID not provided"];
            echo json_encode($response);
        }
        break;

    default:
        $response = ["status" => 0, "message" => "Something went wrong"];
        echo json_encode($response);
}
?>
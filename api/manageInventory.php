<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

function reformatSize($size)
{
    if (preg_match('/^(\d+(\.\d+)?)([a-zA-Z]+)$/', $size, $matches)) {
        $number = $matches[1];
        $unit = ucfirst($matches[3]);
        return $number . $unit;
    }
    return $size;
}

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

        $productSize = trim(strtolower($data['productSize']));
        $productPrice = trim($data['productPrice']);
        $productStock = trim($data['productStock']);
        $shopId = trim($data['shopId']);
        $productId = trim($data['productId']);

        if (empty($productSize) || empty($productPrice) || empty($productStock)) {
            $response = ["status" => 0, "message" => "Product size, price, and stock cannot be empty"];
            echo json_encode($response);
            exit;
        }

        if (!preg_match('/oz$/i', $productSize)) {
            $response = ["status" => 0, "message" => "Product size must end with 'Oz'"];
            echo json_encode($response);
            exit;
        }

        if (!is_numeric($productPrice) || !is_numeric($productStock)) {
            $response = ["status" => 0, "message" => "Product price and stock must be numeric"];
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
        $priceID = trim($data['priceID']);
        $productID = trim($data['productID']);
        $shopID = trim($data['shopID']);
        $productSize = trim(strtolower($data['productSize']));
        $productPrice = trim($data['productPrice']);
        $productStock = trim($data['productStock']);

        if (empty($productSize) || empty($productPrice) || empty($productStock)) {
            $response = ["status" => 0, "message" => "Product size, price, and stock cannot be empty"];
            echo json_encode($response);
            exit;
        }

        if (!preg_match('/oz$/i', $productSize)) {
            $response = ["status" => 0, "message" => "Product size must end with 'Oz'"];
            echo json_encode($response);
            exit;
        }

        if (!is_numeric($productPrice) || !is_numeric($productStock)) {
            $response = ["status" => 0, "message" => "Product price and stock must be numeric"];
            echo json_encode($response);
            exit;
        }

        $formattedSize = reformatSize($productSize);

        $sql = "UPDATE product_price SET productSize = :productSize, productPrice = :productPrice, productStock = :productStock WHERE productID = :productID AND  priceID = :priceID AND shopID = :shopID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':priceID', $priceID);
        $stmt->bindParam(':productID', $productID);
        $stmt->bindParam(':shopID', $shopID);
        $stmt->bindParam(':productSize', $formattedSize);
        $stmt->bindParam(':productPrice', $productPrice);
        $stmt->bindParam(':productStock', $productStock);

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
        $priceID = trim($data['priceID']);

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
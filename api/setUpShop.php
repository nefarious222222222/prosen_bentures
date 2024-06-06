<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $shopData = json_decode(file_get_contents('php://input'));

        if (empty($shopData->accountID)) {
            $response = ["status" => 0, "message" => "Account ID cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($shopData->shopName)) {
            $response = ["status" => 0, "message" => "Shop name cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($shopData->shopDescription)) {
            $response = ["status" => 0, "message" => "Shop description cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($shopData->shopImage)) {
            $response = ["status" => 0, "message" => "Shop image cannot be empty"];
            echo json_encode($response);
            exit();
        }

        $sql = "INSERT INTO shop_info (shopID, accountID, shopName, shopDescription, shopLogo, shopDocument, isVerified, status, shopType) VALUES (null, :accountID, :shopName, :shopDescription, :shopImage, null, 0, 1, :shopType)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountID', $shopData->accountID);
        $stmt->bindParam(':shopName', $shopData->shopName);
        $stmt->bindParam(':shopDescription', $shopData->shopDescription);
        $stmt->bindParam(':shopImage', $shopData->shopImage);
        $stmt->bindParam(':shopType', $shopData->shopType);

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "Shop information saved successfully"];
        } else {
            $response = ["status" => 0, "message" => "Failed to save shop information"];
        }
        echo json_encode($response);
        break;

    case 'GET':
        if (isset($_GET['accountId']) && isset($_GET['status'])) {
            $accountId = $_GET['accountId'];
            $status = $_GET['status'];

            $sql = "SELECT * FROM shop_info WHERE accountID = :accountId AND status = :status";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':accountId', $accountId);
            $stmt->bindParam(':status', $status);
            $stmt->execute();
            $shopInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($shopInfo) {
                echo json_encode($shopInfo);
            } else {
                echo json_encode([]);
            }
        } else {
            $response = ["status" => 0, "message" => "Missing accountId or status"];
            echo json_encode($response);
        }
        break;

    default:
        $response = ["status" => 0, "message" => "Invalid request method"];
        echo json_encode($response);
        break;
}
?>
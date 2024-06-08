<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $cartData = json_decode(file_get_contents('php://input'));

        if (empty($cartData->accountId) || empty($cartData->productId) || empty($cartData->priceId) || empty($cartData->shopId) || empty($cartData->quantity) || empty($cartData->totalPrice)) {
            echo json_encode(["status" => 0, "message" => "Something went wrong"]);
            exit();
        }

        $accountId = $cartData->accountId;
        $productId = $cartData->productId;
        $priceId = $cartData->priceId;
        $shopId = $cartData->shopId;
        $quantity = $cartData->quantity;
        $totalPrice = $cartData->totalPrice;

        $stockSql = "SELECT productStock FROM product_price WHERE priceID = :priceId";
        $stockStmt = $conn->prepare($stockSql);
        $stockStmt->bindParam(':priceId', $priceId);
        $stockStmt->execute();
        $stockData = $stockStmt->fetch(PDO::FETCH_ASSOC);

        if (!$stockData) {
            echo json_encode(["status" => 0, "message" => "Product not found in inventory"]);
            exit();
        }

        $availableStock = $stockData['productStock'];

        $existingCartSql = "SELECT * FROM user_cart WHERE accountID = :accountId AND productID = :productId AND priceID = :priceId";
        $existingCartStmt = $conn->prepare($existingCartSql);
        $existingCartStmt->bindParam(':accountId', $accountId);
        $existingCartStmt->bindParam(':productId', $productId);
        $existingCartStmt->bindParam(':priceId', $priceId);
        $existingCartStmt->execute();
        $existingCart = $existingCartStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingCart) {
            $updatedQuantity = $existingCart['quantity'] + $quantity;

            if ($updatedQuantity > $availableStock) {
                echo json_encode(["status" => 0, "message" => "Requested quantity exceeds available stock"]);
                exit();
            }

            $updatedTotalPrice = $existingCart['totalPrice'] + $totalPrice;

            $updateSql = "UPDATE user_cart SET quantity = :updatedQuantity, totalPrice = :updatedTotalPrice WHERE accountID = :accountId AND productID = :productId AND priceID = :priceId";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bindParam(':updatedQuantity', $updatedQuantity);
            $updateStmt->bindParam(':updatedTotalPrice', $updatedTotalPrice);
            $updateStmt->bindParam(':accountId', $accountId);
            $updateStmt->bindParam(':productId', $productId);
            $updateStmt->bindParam(':priceId', $priceId);

            if ($updateStmt->execute()) {
                echo json_encode(["status" => 1, "message" => "Product quantity updated successfully"]);
            } else {
                echo json_encode(["status" => 0, "message" => "Failed to update product quantity"]);
            }
        } else {
            if ($quantity > $availableStock) {
                echo json_encode(["status" => 0, "message" => "Requested quantity exceeds available stock"]);
                exit();
            }

            $insertSql = "INSERT INTO user_cart (cartID, accountID, productID, priceID, shopID, quantity, totalPrice) 
                        VALUES (null, :accountId, :productId, :priceId, :shopId, :quantity, :totalPrice)";

            $stmt = $conn->prepare($insertSql);
            $stmt->bindParam(':accountId', $accountId);
            $stmt->bindParam(':productId', $productId);
            $stmt->bindParam(':priceId', $priceId);
            $stmt->bindParam(':shopId', $shopId);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':totalPrice', $totalPrice);

            if ($stmt->execute()) {
                echo json_encode(["status" => 1, "message" => "Product added to cart successfully"]);
            } else {
                echo json_encode(["status" => 0, "message" => "Failed to add product to cart"]);
            }
        }
        break;

    case 'GET':
        $accountId = $_GET['accountId'];

        $sql = "SELECT 
                    uc.*,
                    si.shopName,
                    pi.productBrand,
                    pi.productName,
                    pi.productFlavor,
                    pi.productImage,
                    pp.productPrice,
                    pp.productSize,
                    pp.productStock
                FROM 
                    user_cart uc
                    INNER JOIN shop_info si ON uc.shopID = si.shopID
                    INNER JOIN product_info pi ON uc.productID = pi.productID
                    INNER JOIN product_price pp ON uc.priceID = pp.priceID
                WHERE
                uc.accountID = :accountId;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountId', $accountId);
        $stmt->execute();

        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($cartItems);
        break;
    case 'PUT':
        $cartData = json_decode(file_get_contents('php://input'));

        if (empty($cartData->accountId) || empty($cartData->productId) || empty($cartData->priceId) || empty($cartData->quantity) || empty($cartData->totalPrice)) {
            echo json_encode(["status" => 0, "message" => "Something went wrong"]);
            exit();
        } else if (empty($cartData->productStock) || $cartData->productStock == 0) {
            echo json_encode(["status" => 0, "message" => "Cannot update quantity there are no stocks"]);
            exit();
        } else if ($cartData->quantity > $cartData->productStock) {
            echo json_encode(["status" => 0, "message" => "Max quantity is reached"]);
            exit();
        }

        $accountId = $cartData->accountId;
        $productId = $cartData->productId;
        $priceId = $cartData->priceId;
        $quantity = $cartData->quantity;
        $totalPrice = $cartData->totalPrice;

        $existingCartSql = "SELECT * FROM user_cart WHERE accountID = :accountId AND productID = :productId AND priceID = :priceId";
        $existingCartStmt = $conn->prepare($existingCartSql);
        $existingCartStmt->bindParam(':accountId', $accountId);
        $existingCartStmt->bindParam(':productId', $productId);
        $existingCartStmt->bindParam(':priceId', $priceId);
        $existingCartStmt->execute();
        $existingCart = $existingCartStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingCart) {
            $updatedQuantity = $quantity;
            $updatedTotalPrice = $totalPrice;

            $updateSql = "UPDATE user_cart SET quantity = :updatedQuantity, totalPrice = :updatedTotalPrice WHERE accountID = :accountId AND productID = :productId AND priceID = :priceId";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bindParam(':updatedQuantity', $updatedQuantity);
            $updateStmt->bindParam(':updatedTotalPrice', $updatedTotalPrice);
            $updateStmt->bindParam(':accountId', $accountId);
            $updateStmt->bindParam(':productId', $productId);
            $updateStmt->bindParam(':priceId', $priceId);

            if ($updateStmt->execute()) {
                echo json_encode(["status" => 1, "message" => "Product quantity updated successfully"]);
            } else {
                echo json_encode(["status" => 0, "message" => "Failed to update product quantity"]);
            }
        } else {
            echo json_encode(["status" => 0, "message" => "Product not found in cart"]);
        }
        break;

    case 'DELETE':
        $cartData = json_decode(file_get_contents('php://input'));

        if (empty($cartData->accountId) || empty($cartData->productId) || empty($cartData->priceId)) {
            echo json_encode(["status" => 0, "message" => "Failed to remove from your cart"]);
            exit();
        }

        $accountId = $cartData->accountId;
        $productId = $cartData->productId;
        $priceId = $cartData->priceId;

        $deleteSql = "DELETE FROM user_cart WHERE accountID = :accountId AND productID = :productId AND priceID = :priceId";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->bindParam(':accountId', $accountId);
        $deleteStmt->bindParam(':productId', $productId);
        $deleteStmt->bindParam(':priceId', $priceId);

        if ($deleteStmt->execute()) {
            echo json_encode(["status" => 1, "message" => "Product removed from cart successfully"]);
        } else {
            echo json_encode(["status" => 0, "message" => "Failed to remove product from cart"]);
        }
        break;
}
?>
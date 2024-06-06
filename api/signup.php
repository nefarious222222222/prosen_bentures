<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $accountInfo = json_decode(file_get_contents('php://input'));

        if (empty($accountInfo->email)) {
            $response = ["status" => 0, "message" => "Email cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (!filter_var($accountInfo->email, FILTER_VALIDATE_EMAIL)) {
            $response = ["status" => 0, "message" => "Invalid email format"];
            echo json_encode($response);
            exit();
        }

        if (empty($accountInfo->userRole)) {
            $response = ["status" => 0, "message" => "User role cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($accountInfo->password)) {
            $response = ["status" => 0, "message" => "Password cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (empty($accountInfo->confirmPass)) {
            $response = ["status" => 0, "message" => "Confirm password cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (strlen($accountInfo->password) < 8 || !preg_match('/[A-Za-z]/', $accountInfo->password) || !preg_match('/\d/', $accountInfo->password)) {
            $response = ["status" => 0, "message" => "Password must have at least 8 characters and include both numbers and characters"];
            echo json_encode($response);
            exit();
        }

        if ($accountInfo->password !== $accountInfo->confirmPass) {
            $response = ["status" => 0, "message" => "Password and confirm password do not match"];
            echo json_encode($response);
            exit();
        }

        if (empty($accountInfo->phone)) {
            $response = ["status" => 0, "message" => "Phone cannot be empty"];
            echo json_encode($response);
            exit();
        }

        if (strlen($accountInfo->phone) !== 11) {
            $response = ["status" => 0, "message" => "Phone number must be 11 characters long"];
            echo json_encode($response);
            exit();
        }

        $hashedPassword = password_hash($accountInfo->password, PASSWORD_DEFAULT);

        $checkEmailSql = "SELECT * FROM account_info WHERE email = :email";
        $checkEmailStmt = $conn->prepare($checkEmailSql);
        $checkEmailStmt->bindParam(':email', $accountInfo->email);
        $checkEmailStmt->execute();
        $existingEmail = $checkEmailStmt->fetch(PDO::FETCH_ASSOC);

        $checkPhoneSql = "SELECT * FROM account_info WHERE phone = :phone";
        $checkPhoneStmt = $conn->prepare($checkPhoneSql);
        $checkPhoneStmt->bindParam(':phone', $accountInfo->phone);
        $checkPhoneStmt->execute();
        $existingPhone = $checkPhoneStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingEmail) {
            $response = ["status" => 0, "message" => "Email already exists"];
        } elseif ($existingPhone) {
            $response = ["status" => 0, "message" => "Phone number already exists"];
        } else {
            $sql = "INSERT INTO account_info(accountID, email, userRole, password, phone) VALUES(null, :email, :userRole, :password, :phone)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $accountInfo->email);
            $stmt->bindParam(':userRole', $accountInfo->userRole);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':phone', $accountInfo->phone);
            if ($stmt->execute()) {
                $response = ["status" => 1, "message" => "Account created successfully"];
            } else {
                $response = ["status" => 0, "message" => "Failed to create account"];
            }
        }

        echo json_encode($response);
        break;
}
?>
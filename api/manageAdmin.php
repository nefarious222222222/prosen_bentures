<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, PUT");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'POST':
        $accountInfo = json_decode(file_get_contents('php://input'));

        $requiredAccountFields = ['email', 'userRole', 'password', 'confirmPass', 'phone'];
        foreach ($requiredAccountFields as $field) {
            if (empty($accountInfo->{$field})) {
                $response = ["status" => 0, "message" => ucfirst($field) . " cannot be empty"];
                echo json_encode($response);
                exit();
            }
        }

        if (!filter_var($accountInfo->email, FILTER_VALIDATE_EMAIL)) {
            $response = ["status" => 0, "message" => "Invalid email format"];
            echo json_encode($response);
            exit();
        }

        if (strlen($accountInfo->password) < 8 || !preg_match('/[A-Za-z]/', $accountInfo->password) || !preg_match('/\d/', $accountInfo->password)) {
            $response = ["status" => 0, "message" => "Password must have at least 8 characters and include both letters and numbers"];
            echo json_encode($response);
            exit();
        }

        if ($accountInfo->password !== $accountInfo->confirmPass) {
            $response = ["status" => 0, "message" => "Password and confirm password do not match"];
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
            $insertAccountSql = "INSERT INTO account_info(email, userRole, password, phone) 
                                 VALUES(:email, :userRole, :password, :phone)";
            $stmtAccount = $conn->prepare($insertAccountSql);
            $stmtAccount->bindParam(':email', $accountInfo->email);
            $stmtAccount->bindParam(':userRole', $accountInfo->userRole);
            $stmtAccount->bindParam(':password', $hashedPassword);
            $stmtAccount->bindParam(':phone', $accountInfo->phone);

            $stmtAccount->execute();

            $response = ["status" => 1, "message" => "Account created successfully"];
        }

        echo json_encode($response);
        break;

    case 'GET';
        if (isset($_GET['accountId'])) {
            $accountId = $_GET['accountId'];

            $sql = "SELECT * FROM account_info WHERE accountId = :accountId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':accountId', $accountId);
            $stmt->execute();
            $account = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($account) {
                $response = ["status" => 1, "data" => $account];
            } else {
                $response = ["status" => 0, "message" => "Account not found"];
            }

            echo json_encode($response);
        } else {
            echo json_encode(["status" => 0, "message" => "AccountId is required"]);
        }
        break;

    case 'PUT';
        $accountInfo = json_decode(file_get_contents('php://input'));

        if (!isset($accountInfo->accountId)) {
            $response = ["status" => 0, "message" => "AccountId is required"];
            echo json_encode($response);
            exit();
        }

        $requiredAccountFields = ['email', 'userRole', 'phone'];
        foreach ($requiredAccountFields as $field) {
            if (empty($accountInfo->{$field})) {
                $response = ["status" => 0, "message" => ucfirst($field) . " cannot be empty"];
                echo json_encode($response);
                exit();
            }
        }

        if (!filter_var($accountInfo->email, FILTER_VALIDATE_EMAIL)) {
            $response = ["status" => 0, "message" => "Invalid email format"];
            echo json_encode($response);
            exit();
        }

        if (strlen($accountInfo->phone) !== 11) {
            $response = ["status" => 0, "message" => "Phone number must be 11 characters long"];
            echo json_encode($response);
            exit();
        }

        $stmt = $conn->prepare("SELECT email, userRole, phone FROM account_info WHERE accountId = :accountId");
        $stmt->bindParam(':accountId', $accountInfo->accountId);
        $stmt->execute();
        $existingAccount = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingAccount) {
            $response = ["status" => 0, "message" => "Account not found"];
            echo json_encode($response);
            exit();
        }

        $stmt = $conn->prepare("SELECT COUNT(*) FROM account_info WHERE (email = :email OR phone = :phone) AND accountId != :accountId");
        $stmt->bindParam(':email', $accountInfo->email);
        $stmt->bindParam(':phone', $accountInfo->phone);
        $stmt->bindParam(':accountId', $accountInfo->accountId);
        $stmt->execute();
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            $response = ["status" => 0, "message" => "Email or phone already exists"];
            echo json_encode($response);
            exit();
        }

        $noChanges = true;
        $updateFields = [];
        if ($accountInfo->email !== $existingAccount['email']) {
            $updateFields['email'] = $accountInfo->email;
            $noChanges = false;
        }
        if ($accountInfo->userRole !== $existingAccount['userRole']) {
            $updateFields['userRole'] = $accountInfo->userRole;
            $noChanges = false;
        }
        if ($accountInfo->phone !== $existingAccount['phone']) {
            $updateFields['phone'] = $accountInfo->phone;
            $noChanges = false;
        }

        if (!empty($accountInfo->password)) {
            if (strlen($accountInfo->password) < 8 || !preg_match('/[A-Za-z]/', $accountInfo->password) || !preg_match('/\d/', $accountInfo->password)) {
                $response = ["status" => 0, "message" => "Password must have at least 8 characters and include both letters and numbers"];
                echo json_encode($response);
                exit();
            }

            if ($accountInfo->password !== $accountInfo->confirmPass) {
                $response = ["status" => 0, "message" => "Password and confirm password do not match"];
                echo json_encode($response);
                exit();
            }

            $hashedPassword = password_hash($accountInfo->password, PASSWORD_DEFAULT);
            $updateFields['password'] = $hashedPassword;
            $noChanges = false;
        }

        if ($noChanges) {
            $response = ["status" => 1, "message" => "No changes detected"];
            echo json_encode($response);
            exit();
        }

        $updateSql = "UPDATE account_info SET ";
        $params = [];
        foreach ($updateFields as $field => $value) {
            $updateSql .= "$field = :$field, ";
            $params[":$field"] = $value;
        }
        $updateSql = rtrim($updateSql, ', ') . " WHERE accountId = :accountId";
        $params[':accountId'] = $accountInfo->accountId;

        $stmt = $conn->prepare($updateSql);
        foreach ($params as $param => $value) {
            $stmt->bindValue($param, $value);
        }

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "Account updated successfully"];
        } else {
            $response = ["status" => 0, "message" => "Failed to update account"];
        }

        echo json_encode($response);
        break;
}
?>
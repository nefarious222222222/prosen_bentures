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
}
?>
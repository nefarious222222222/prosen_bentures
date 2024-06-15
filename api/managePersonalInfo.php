<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        $accountId = $_GET['accountId'];

        $sql = "SELECT p.*, a.email, a.userRole, a.phone 
                FROM account_info a
                LEFT JOIN personal_info p ON p.accountID = a.accountID
                WHERE a.accountID = :accountId";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountId', $accountId);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData) {
            echo json_encode($userData);
        } else {
            $response = ["status" => 0, "message" => "Please set up your profile"];
            echo json_encode($response);
        }
        break;

    case 'POST':
        $personalInfo = json_decode(file_get_contents('php://input'));

        $requiredFields = ['firstName', 'lastName', 'birthdate', 'gender', 'street', 'barangay', 'municipality', 'province', 'zip', 'accountId', 'profileImage'];
        $missingFields = [];

        foreach ($requiredFields as $field) {
            if (empty($personalInfo->$field)) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            $response = ["status" => 0, "message" => "Required fields are missing: " . implode(', ', $missingFields)];
            echo json_encode($response);
            exit();
        }

        $sqlCheck = "SELECT * FROM personal_info WHERE accountID = :accountId";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bindParam(':accountId', $personalInfo->accountId);
        $stmtCheck->execute();
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            $response = ["status" => 0, "message" => "User with accountID does not exist"];
            echo json_encode($response);
            exit();
        }

        $isChanged = false;
        foreach ($requiredFields as $field) {
            if ($field !== 'accountId' && $personalInfo->$field != $result[$field]) {
                $isChanged = true;
                break;
            }
        }

        if (!$isChanged) {
            $response = ["status" => 0, "message" => "No changes detected"];
            echo json_encode($response);
            exit();
        }

        $sql = "UPDATE personal_info SET 
            firstName = :firstName, 
            lastName = :lastName, 
            birthdate = :birthdate, 
            gender = :gender, 
            street = :street, 
            barangay = :barangay, 
            municipality = :municipality, 
            province = :province, 
            zip = :zip, 
            profileImage = :profileImage
        WHERE accountID = :accountId";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':profileImage', $personalInfo->profileImage);
        $stmt->bindParam(':firstName', $personalInfo->firstName);
        $stmt->bindParam(':lastName', $personalInfo->lastName);
        $stmt->bindParam(':birthdate', $personalInfo->birthdate);
        $stmt->bindParam(':gender', $personalInfo->gender);
        $stmt->bindParam(':street', $personalInfo->street);
        $stmt->bindParam(':barangay', $personalInfo->barangay);
        $stmt->bindParam(':municipality', $personalInfo->municipality);
        $stmt->bindParam(':province', $personalInfo->province);
        $stmt->bindParam(':zip', $personalInfo->zip);
        $stmt->bindParam(':accountId', $personalInfo->accountId);

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "Personal Information has been updated successfully"];
        } else {
            $response = ["status" => 0, "message" => "Failed to save user personal data"];
        }

        echo json_encode($response);
        break;
}
?>
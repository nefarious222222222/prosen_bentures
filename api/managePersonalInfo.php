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

        if (empty($personalInfo->firstName) || empty($personalInfo->lastName) || empty($personalInfo->birthdate) || empty($personalInfo->gender) || empty($personalInfo->street) || empty($personalInfo->barangay) || empty($personalInfo->municipality) || empty($personalInfo->province) || empty($personalInfo->zip) || empty($personalInfo->accountID)) {
            $response = ["status" => 0, "message" => "All fields are required"];
            echo json_encode($response);
            exit();
        }

        $sqlCheck = "SELECT * FROM personal_info WHERE accountID = :accountID";
        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bindParam(':accountID', $personalInfo->accountID);
        $stmtCheck->execute();
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $sql = "UPDATE personal_info SET 
                            firstName = :firstName, 
                            lastName = :lastName, 
                            birthdate = :birthdate, 
                            gender = :gender, 
                            street = :street, 
                            barangay = :barangay, 
                            municipality = :municipality, 
                            province = :province, 
                            zip = :zip 
                        WHERE accountID = :accountID";
        } else {
            $sql = "INSERT INTO personal_info (personalID, accountID, firstName, lastName, birthdate, gender, street, barangay, municipality, province, zip) 
                        VALUES (null, :accountID, :firstName, :lastName, :birthdate, :gender, :street, :barangay, :municipality, :province, :zip)";
        }

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':accountID', $personalInfo->accountID);
        $stmt->bindParam(':firstName', $personalInfo->firstName);
        $stmt->bindParam(':lastName', $personalInfo->lastName);
        $stmt->bindParam(':birthdate', $personalInfo->birthdate);
        $stmt->bindParam(':gender', $personalInfo->gender);
        $stmt->bindParam(':street', $personalInfo->street);
        $stmt->bindParam(':barangay', $personalInfo->barangay);
        $stmt->bindParam(':municipality', $personalInfo->municipality);
        $stmt->bindParam(':province', $personalInfo->province);
        $stmt->bindParam(':zip', $personalInfo->zip);

        if ($stmt->execute()) {
            $response = ["status" => 1, "message" => "User personal data saved successfully"];
        } else {
            $response = ["status" => 0, "message" => "Failed to save user personal data"];
        }

        echo json_encode($response);
        break;
}
?>
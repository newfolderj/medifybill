<?php
require './PHPMailer/src/PHPMailer.php';
require './PHPMailer/src/SMTP.php';
require './PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $department = trim($_POST["department"]);
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $message = trim($_POST["message"]);

    // Validate the form data
    if (empty($department) || empty($name) || empty($email) || empty($phone) || empty($message)) {
        echo "Please complete the form and try again.";
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = '64.233.167.108'; // Use the correct host or IP address
        $mail->SMTPAuth = true;
        $mail->Username = 'medifybill@gmail.com'; // Replace with your Gmail address
        $mail->Password = 'wevn ctmd sndn spoe';   // Replace with your Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587; // TLS port

        // Bypass SSL verification for local testing
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ];

        // Set email details
        $mail->setFrom('medifybill@gmail.com', 'Appointment Form');
        $mail->addAddress('info@medifybill.com'); // Replace with recipient email
        $mail->Subject = 'New Appointment Form Submission';
        $mail->Body = "Department: $department\nName: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";

        // Send email
        $mail->send();

        // Redirect user to confirmation page
        header("Location: https://www.medifybill.com/confirmation.html");
        exit;

    } catch (Exception $e) {
        // Show error message if email fails
        echo "Oops! Something went wrong. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "There was a problem with your submission. Please try again.";
}
?>
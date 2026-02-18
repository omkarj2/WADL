<!-- <h1>With Ajax</h1> -->

<?php
    $action = $_POST['action'] ?? '';

    if ($action === 'assignment') {
        // sanitize inputs
        $subject = htmlspecialchars($_POST['subject'] ?? '');
        $title = htmlspecialchars($_POST['title'] ?? '');
        $deadline = htmlspecialchars($_POST['deadline'] ?? '');

        // prepare assignment record
        $assignment = [
            'subject' => $subject,
            'title' => $title,
            'deadline' => $deadline,
            'created_at' => date('c')
        ];

        // file to store assignments (in the same folder)
        $file = __DIR__ . '/assignments.json';

        // load existing assignments if present
        if (file_exists($file)) {
            $json = file_get_contents($file);
            $data = json_decode($json, true);
            if (!is_array($data)) {
                $data = [];
            }
        } else {
            $data = [];
        }

        // append and save with exclusive lock
        $data[] = $assignment;
        $saved = file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);

        if ($saved === false) {
            echo "<h1>Error saving assignment</h1>";
        } else {
            echo "<h1> Assignment Uploaded </h1>";
            echo "<div>Subject - " . $subject . "</div>";
            echo "<div>Assignment Title: " . $title . "</div>";
            echo "<div>Deadline : " . $deadline . "</div>";
            echo "<div>Saved to assignments.json</div>";
        }
    } elseif ($action === 'login') {
        $username = $_POST['username'];
        $password = $_POST['password'];

        if ($username === 'omkar' && $password === '1234') {
            echo "<h1> Welcome , $username </h1>" ;
            echo "<a href='/33245/assignment1B/teacher.html'> Go to Dashboard </a>";
        } else {
            echo "Invalid Credentials";
        }
    } else {
        echo "<h1>Invalid action</h1>";
    }

    
?>
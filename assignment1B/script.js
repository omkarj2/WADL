console.log('script.js loaded');

function submitForm(e){
    if(e && typeof e.preventDefault === 'function') e.preventDefault();

    var subject = $('input[name=subject]').val();
    var title = $('input[name=title]').val();
    var deadline = $('input[name=deadline]').val();

    var formData = 'action=assignment' + '&subject=' + encodeURIComponent(subject) + '&title=' + encodeURIComponent(title) + '&deadline=' + encodeURIComponent(deadline);

    if (typeof $ !== 'function') {
        console.error('jQuery not found, cannot submit form');
        return;
    }

    $.ajax({
        type:"POST",
        url:"output.php",
        data: formData,
    }).done(function(response){
        var new_window = window.open('','_blank');
        new_window.document.write(response);
    }).fail(function(xhr, status, err){
        console.error('AJAX error:', status, err);
        alert('Failed to submit assignment.');
    });
}

function loginForm(e){
    if(e && typeof e.preventDefault === 'function') e.preventDefault();

    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();

    var formData = 'action=login' + '&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);

    if (typeof $ !== 'function') {
        console.error('jQuery not found, cannot login');
        return;
    }

    $.ajax({
        type:"POST",
        url:"output.php",
        data: formData,
    }).done(function(response){
        var new_window = window.open('','_blank');
        new_window.document.write(response);
    }).fail(function(xhr, status, err){
        console.error('Login AJAX error:', status, err);
        alert('Login failed.');
    });
}

// View toggling for teacher/student pages
$(document).ready(function(){
    console.log('jQuery ready - attaching nav handlers');

    $('#nav-add-assignment').on('click', function(e){
        e.preventDefault();
        $('.nav-link').removeClass('active bg-success bg-primary');
        $(this).addClass('active bg-success');
        $('#dashboardView').hide();
        $('#addAssignmentView').show();
        console.log('Add Assignment clicked');
    });

    $('#nav-dashboard').on('click', function(e){
        e.preventDefault();
        $('.nav-link').removeClass('active bg-success bg-primary');
        $(this).addClass('active bg-success');
        $('#addAssignmentView').hide();
        $('#dashboardView').show();
        console.log('Dashboard clicked');
    });

    $('#nav-assignment-list').on('click', function(e){
        e.preventDefault();
        $('.nav-link').removeClass('active bg-success bg-primary');
        $(this).addClass('active bg-success');
        $('#addAssignmentView').hide();
        $('#dashboardView').show();
        console.log('Assignment List clicked');
    });
});
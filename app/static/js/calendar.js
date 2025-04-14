$(document).ready(function () {
    // Initialize FullCalendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'year,month,agendaWeek,agendaDay'
        },
        views: {
            year: {
                type: 'month',
                duration: { years: 1 },
                buttonText: 'Year'
            }
        },
        editable: true,
        selectable: true,
        eventLimit: true,
        events: '/api/appointments/',
        eventColor: '#66ccff',
        eventRender: function (event, element) {
            if (event.description) {
                element.find('.fc-title').append("<br/><span class='fc-description'>" + event.description + "</span>");
            }
        }
    });

    // Show modal on button click
    $('#addAppointmentBtn').click(function () {
        $('#appointmentModal').modal('show');
    });

    // Save appointment
    $('#saveAppointmentBtn').click(function () {
        const title = $('#title').val();
        const start_time = $('#start_time').val();
        const end_time = $('#end_time').val();
        const color = $('#color').val();
        const user_id = $('#user_id').val();

        if (!title || !start_time || !end_time) {
            alert("Please fill all required fields.");
            return;
        }

        $.ajax({
            url: '/api/appointments/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                start_time: start_time,
                end_time: end_time,
                color: color,
                user_id: user_id
            }),
            success: function () {
                $('#calendar').fullCalendar('refetchEvents');
                $('#appointmentModal').modal('hide');
                $('#appointmentForm')[0].reset();
            },
            error: function (err) {
                console.log("Full error:", err);
                alert("Error: " + (err.responseJSON?.error || "Could not save appointment."));
            }
        });
    });
});

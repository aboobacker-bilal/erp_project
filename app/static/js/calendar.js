$(document).ready(function () {
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
        selectHelper: true,
        eventLimit: true,
        events: {
            url: '/api/appointments/',
            method: 'GET',
            failure: function() {
                alert('Error loading appointments!');
            }
        },
        eventRender: function(event, element) {
            if (event.description) {
                element.find('.fc-title').append("<br/><span class='fc-description'>" + event.description + "</span>");
            }
        },
        select: function(start, end) {
            resetForm();
            const now = moment();
            $('#start_time').val(now.format('YYYY-MM-DDTHH:mm'));
            $('#end_time').val(now.add(1, 'hour').format('YYYY-MM-DDTHH:mm'));
            $('#appointmentModal').modal('show');
        },
        eventClick: function(calEvent, jsEvent, view) {

            $('#title').val(calEvent.title);
            $('#start_time').val(moment(calEvent.start).format('YYYY-MM-DD HH:mm:ss'));
            $('#end_time').val(moment(calEvent.end).format('YYYY-MM-DD HH:mm:ss'));
            $('#color').val(calEvent.color || '#007bff');
            $('#appointmentId').val(calEvent.id);

            $('#appointmentModalLabel').text('Edit Appointment');
            $('#deleteAppointmentBtn').show();
            $('#saveAppointmentBtn').text('Update');

            $('#appointmentModal').modal('show');
        },
        eventDrop: function(event, delta, revertFunc) {
            updateAppointment({
                id: event.id,
                title: event.title,
                start: event.start.format(),
                end: event.end ? event.end.format() : event.start.clone().add(1, 'hour').format(),
                color: event.color,
                user_id: $('#user_id').val()
            });
        },
        eventResize: function(event, delta, revertFunc) {
            updateAppointment({
                id: event.id,
                title: event.title,
                start: event.start.format(),
                end: event.end.format(),
                color: event.color,
                user_id: $('#user_id').val()
            });
        }
    });

    $('#addAppointmentBtn').click(function() {
        resetForm();
        const now = moment();
        $('#start_time').val(now.format('YYYY-MM-DDTHH:mm'));
        $('#end_time').val(now.add(1, 'hour').format('YYYY-MM-DDTHH:mm'));
        $('#appointmentModal').modal('show');
    });

    $('#saveAppointmentBtn').click(function() {
        const appointmentId = $('#appointmentId').val();
        const title = $('#title').val();
        const start = $('#start_time').val();
        const end = $('#end_time').val();
        const color = $('#color').val();
        const userId = $('#user_id').val();

        if (!title || !start || !end) {
            alert('Please fill all required fields');
            return;
        }

        const appointmentData = {
            title: title,
            start: start,
            end: end,
            color: color,
            user_id: userId
        };

        const method = appointmentId ? 'PUT' : 'POST';
        const url = appointmentId ? `/api/appointments/${appointmentId}` : '/api/appointments/';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(appointmentData),
            success: function() {
                $('#calendar').fullCalendar('refetchEvents');
                $('#appointmentModal').modal('hide');
                resetForm();
            },
            error: function(err) {
                alert('Error: ' + (err.responseJSON?.error || 'Could not save appointment'));
                console.error('Error:', err);
            }
        });
    });

    $('#deleteAppointmentBtn').click(function() {
        const appointmentId = $('#appointmentId').val();

        if (!appointmentId) {
            alert('No appointment selected');
            return;
        }

        if (confirm('Delete this appointment permanently?')) {
            $.ajax({
                url: `/api/appointments/${appointmentId}`,
                method: 'DELETE',
                success: function() {
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#appointmentModal').modal('hide');
                    resetForm();
                },
                error: function(err) {
                    alert('Error: ' + (err.responseJSON?.error || 'Could not delete appointment'));
                }
            });
        }
    });

    $('#appointmentModal').on('hidden.bs.modal', resetForm);

    function resetForm() {
        $('#appointmentForm')[0].reset();
        $('#appointmentId').val('');
        $('#color').val('#007bff');
        $('#appointmentModalLabel').text('Add Appointment');
        $('#deleteAppointmentBtn').hide();
        $('#saveAppointmentBtn').text('Save');
    }

    function updateAppointment(data) {
        $.ajax({
            url: `/api/appointments/${data.id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function() {
                $('#calendar').fullCalendar('refetchEvents');
            },
            error: function(err) {
                $('#calendar').fullCalendar('refetchEvents');
                alert('Error updating: ' + (err.responseJSON?.error || 'Try again'));
            }
        });
    }
});
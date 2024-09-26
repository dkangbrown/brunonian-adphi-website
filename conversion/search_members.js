const filepath_to_json = "undergrads";

function init() {
    console.log('being called');
    $.get(filepath_to_json, function(data) {
        console.log(data)
    });
}

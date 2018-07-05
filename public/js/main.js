var apiClient = axios.create()

var $countiesList = $('.counties.list')
var $modalContent = $('.ui.modal .content')
var $modalHeader = $('.ui.modal .header')

$countiesList.on("click", "li", function() {
    var slug = $(this).attr("id")
    apiClient({ method: "get", url: `/api/counties/${slug}`}).then((apiResponse) => {

        $modalHeader.text($(this).text())
        var spots = apiResponse.data

        console.log(spots)
        
        // loop through spots array
        // for each spot, append 
        if (spots.length === 0){
            $modalContent.append("<h1>No Spots Available</h1>")
        }
        else {
            $modalContent.empty()
            spots.forEach((s) => {
                    $modalContent.append(`<h1><a href="/spots/${Number(s.spot_id)}">${s.spot_name}</a></h1>`) 
            })
        }
        
        
        $('.ui.modal').modal('show')
    })
})
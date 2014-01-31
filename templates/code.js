
      $(document).ready(function(){                      
          caller();
        });
      function drawData(obj){
         var tempbool = String($("*:focus").is("textarea, input"));
         if ($('input:enabled[value!=""]').length<1 && tempbool=="false" ){
          console.log(obj);
                  $("#log").html("");
                  var tempString= "<table class='table table-striped'>";
                  for(var key in obj){
                    if (obj[key][2]=="active"){
                      if(obj[key][1]==103){
                        var butt = "warning disabled ";
                        var butttext = "Awaiting Payment";
                        var amt = obj[key][3];
                  tempString+= "<tr id='"+key+"0'>";
                  tempString += "<td id='"+key+"1'>" + key + "</td><td><input disabled='disabled' id='" + key+"2' value='"+amt+"'></td><td><button onclick='makePay(this)' type='button' class='btn btn-"+butt+" btn-sm' id='" + key+"3'>"+butttext+"</button></td></tr>"

                      }
                      else if(obj[key][1]==105){
                        var butt = "success disabled ";
                        var butttext = "Payment Received";
                        var amt = obj[key][3];
                  tempString+= "<tr id='"+key+"0'>";
                  tempString += "<td id='"+key+"1'>" + key + "</td><td><input disabled='disabled' id='" + key+"2' value='"+amt+"'></td><td><button onclick='makePay(this)' type='button' class='btn btn-"+butt+" btn-sm' id='" + key+"3'>"+butttext+"</button></td></tr>"

                      }
                      else{
                        var butt = "info";
                        var butttext = "Request Payment";
                  tempString+= "<tr id='"+key+"0'>";
                  tempString += "<td id='"+key+"1'>" + key + "</td><td><input id='" + key+"2'></td><td><button onclick='makePay(this)' type='button' class='btn btn-"+butt+" btn-sm' id='" + key+"3'>"+butttext+"</button></td></tr>"
                      }
                    }
                    else{
                  tempString+= "<tr id='"+key+"0'>";
                  tempString += "<td id='"+key+"1'>" + key + "</td><td><input disabled='disabled' id='" + key+"2'></td><td><button type='button' class='btn btn-danger btn-sm disabled' id='" + key+"3'>Request Payment</button></td><td id='"+key+"4' onclick='redraw(this)'><span class='glyphicon glyphicon-remove'></span></td></tr>"
                    }
        
                  }
                  tempString += "</table>"
                  $('#log').html(tempString);
  
              }}
        function caller(){
          var getData = $.getJSON("/users", function(data){
            globData = data;
            drawData(data);
            setTimeout(caller, 10000);
          
          });
        }

        function makePay(curr){
          var ider = curr.id;
          ider = ider.slice(0,ider.length-1);
          $("#"+ider+"2").attr("disabled", "disabled");
          var amount = $("#"+ider+"2").val()
            ider = ider + "," + amount;
          console.log(ider);
          $.getJSON("/payfront/"+ider, function(data){
              console.log(data);
                drawData(data);
                
                });
          //I was working here, get id, make rest req, delete user from conns in backend

        }
        function redraw(cur){
          var numb = cur.id;
          var ider = numb.slice(0,numb.length-1);
          $.getJSON("/delfront/"+ider,function(data){
              drawData(data);
              })
        }
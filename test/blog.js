var article_id = document.getElementsByClassName("article-headline")[0].id;

function close_msg_box(el, animation){
  var div = el;
  if(div.className.includes("messege-box-overlay")){
    div.style.display = "none";
    return;
  }
  else{
    while(!div.className.includes("fade__out")){
      div = div.parentElement;
      console.log(div.className);
    }
  }
  if (animation){
    div.style.opacity = "0";
    setTimeout(function(){
      // div.style.display = "none";
      div.parentElement.style.display = "none";
    }, 600);
  }
  else{
    div.style.opacity = "0";
    div.parentElement.style.display = "none";
  }
}

// these are relative to the viewport, i.e. the window

function move_side_socials(){

  function element_pos(el){
    var padding = 20;
    var viewportOffset = el.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var clientTop = docEl.clientTop || body.clientTop || 0;

    return Math.round(viewportOffset.top +  scrollTop - clientTop) - padding;
  }

  var top_el = element_pos(document.getElementsByClassName("ver-sharing-wrap")[0]);

  var article_el_height = document.getElementsByClassName("article-wrapper")[0].offsetHeight;

  var end_movement = article_el_height + element_pos(document.getElementsByClassName("article-wrapper")[0]) - document.getElementsByClassName("ver-sharing")[0].clientHeight;

  window.addEventListener("resize", function(){ //since the article wrapper will change hight, this event will update the value.
    top_el = element_pos(document.getElementsByClassName("ver-sharing-wrap")[0]);
    article_el_height = document.getElementsByClassName("article-wrapper")[0].offsetHeight;
    end_movement = article_el_height + element_pos(document.getElementsByClassName("article-wrapper")[0]) - document.getElementsByClassName("ver-sharing")[0].clientHeight;
  },false);

  window.addEventListener("scroll", function(){

    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    console.log(top_el,end_movement,top);
    if (top-top_el > 0 && top - end_movement < 0){
      document.getElementsByClassName("ver-sharing")[0].style.marginTop = top-top_el + "px";
    }

  }, false);
}

window.addEventListener("resize", function(){
  if (window.innerHeight > document.getElementsByClassName("article-wrapper")[0].offsetHeight + 50){
    document.getElementsByClassName("ver-sharing-wrap")[0].style.display = "none";
  }
  else{
    if(window.innerWidth >= 980){
      document.getElementsByClassName("ver-sharing-wrap")[0].style.display = "block";
    }
  }
}, false);

window.addEventListener("load", function(){

  //* pinterest */

  var pinterestBtns = document.getElementsByClassName("pinterest");

  for (var btn = 0; btn < pinterestBtns.length; btn++){
    function closure(btn){
      pinterestBtns[btn].addEventListener("click", function(){
        PinUtils.pinAny();
      }, false)
    }
    closure(btn);
  }

  move_side_socials();

  var order = document.getElementsByClassName("order-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.order;
  var display = document.getElementsByClassName("display-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.display;
  feedback(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/feedback/"+article_id, function(){
    load_comments(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comments/"+article_id+"/"+order+"/"+display+"/1");
  });
  comment_settings();

  document.onclick = function(e){
    if(e.target.className.includes("messege-box-overlay")){
      close_msg_box(e.target, true);
    }
  }

  document.getElementsByClassName("submit_comment_report")[0].addEventListener("click", function(){

    var optionsDivs = document.getElementsByClassName("all-report-options")[0].getElementsByClassName("report-opt");
    for (var div = 0; div < optionsDivs.length; div++){
      if(optionsDivs[div].getElementsByClassName("report-ans")[0].checked == true){
        var report_msg = "";
        if (div == optionsDivs.length-1){
          report_msg = document.getElementById("report-something-else-textbox").value;
        }
        else{
          report_msg = optionsDivs[div].getElementsByClassName("report-ans")[0].value;
        }

        if(document.getElementsByClassName("report-comment-window")[0].getElementsByClassName("report_agreement")[0].checked){
          close_msg_box(this, false);
          report(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/report_comment/"+report_msg+"/"+this.dataset.removeId);
        }
        else{
          document.getElementsByClassName("report-comment-window")[0].getElementsByClassName("cation-message")[0].innerHTML += "<p style='color: red;'>! You need to agree with the terms in order to proceed.</p>";
        }
      }
    }
  }, false)

  document.getElementsByClassName("remove-comment-final-warning")[0].onclick = function(){
    var comm_ID = this.dataset.removeId; //comment id to which the user replied to
    var comment_element = document.getElementById("comment-"+comm_ID); //comment element to which the user replied to
    //console.log(comment_element,comm_ID,replies_btns[btn],btn) //debug

    var root_ID = comment_element.dataset.rootId; //root comment id

    //console.log(root_ID,comm_ID,article_id)
    delete_comment(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/delete_comment/"+root_ID+"/"+comm_ID+"/"+article_id, comm_ID);

    close_msg_box(this, true);
  }

  //feedback
  if (document.getElementsByClassName("feedback-options")[0] != undefined){
    var feedback_btns = document.getElementsByClassName("feedback-options")[0].children;
    for (var btn = 0; btn<feedback_btns.length; btn++){
      feedback_btns[btn].addEventListener("click", function(){
        var feedback = this.dataset.feedback;
        feedback(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/feedback/"+article_id+"/"+feedback);
      }, false);
    }
  }

  var msg_boxes = document.getElementsByClassName("close-msg-box");

  for(var box = 0; box < msg_boxes.length; box++){
    function closure(box){
      msg_boxes[box].addEventListener("click", function(){
        close_msg_box(this, true);
      }, false)
    }
    closure(box);
  }

}, false);

function comment_settings(){
  var order_dropdown_options = document.getElementsByClassName("order-dropdown")[0].getElementsByClassName("popup__action");
  var display_dropdown_options = document.getElementsByClassName("display-dropdown")[0].getElementsByClassName("popup__action");
  var order_dropdown = document.getElementsByClassName("order-dropdown")[0];
  var display_dropdown = document.getElementsByClassName("display-dropdown")[0];

  //applies the settings adjusted by the user
  function apply_settings(dropdown, options, other_dropdown, setting_type){
    for (var btn = 0; btn < options.length; btn++){
      function closure(btn){
        options[btn].addEventListener("click", function(){

          var setting = this.getAttribute("data-"+setting_type); //getting the setting dropdown selection
          var setting_span = this.getElementsByClassName("option-title")[0].innerHTML; //getting the setting title
          dropdown.getElementsByClassName("button__toggle")[0].setAttribute("data-"+setting_type, setting); //changing the top toggle button
          dropdown.getElementsByClassName("button__toggle")[0].getElementsByClassName("option-title")[0].innerHTML = setting_span; //changing the toggle button title

          if (setting_type == "order"){ //if this is the order setting
            var other_setting = other_dropdown.getElementsByClassName("button__toggle")[0].getAttribute("data-display"); //getting the option sleected on the other setting
            load_comments(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comments/"+article_id+"/"+setting+"/"+other_setting+"/1"); // url parameters : artice_id/order/display/page
          }
          else if(setting_type == "display"){ //if this is the display setting
            var other_setting = other_dropdown.getElementsByClassName("button__toggle")[0].getAttribute("data-order"); //getting the option sleected on the other setting
            document.getElementsByClassName("comments_pages_list")[0].innerHTML = "";
            load_comments(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comments/"+article_id+"/"+other_setting+"/"+setting+"/1"); // url parameters : artice_id/order/display/page
          }
        }, false);
      }
      closure(btn);
    }
  }

  apply_settings(order_dropdown, order_dropdown_options, display_dropdown, "order");
  apply_settings(display_dropdown, display_dropdown_options, order_dropdown, "display");
}

function add_functionality(){

  var comments_list = document.getElementsByClassName("post");
  var comments_list_options = document.getElementsByClassName("comment-options");
  var replies_btns = document.getElementsByClassName("reply-btn");
  var reply_txtboxes = document.getElementsByClassName("reply-input-wrapper");
  var reply_submit_btns = document.getElementsByClassName("submit-reply");
  var reply_cancel_btns = document.getElementsByClassName("cancel-reply");
  var preview_btns = document.getElementsByClassName("reply-preview");


  if (comments_list != undefined){
    for (var btn = 0; btn < comments_list.length; btn++){
      function closure(btn){ //storing the value of btn in the function closure, so now every reply button has its event

        if (replies_btns[btn] != undefined){
          replies_btns[btn].addEventListener("click", function(){
            //hidding all visible reply textboxes

            for (var reply_txtbox_wrap = 0; reply_txtbox_wrap < replies_btns.length; reply_txtbox_wrap++){
              reply_txtboxes[reply_txtbox_wrap].style.display = "none";
            }

            document.getElementsByClassName("reply-input-wrapper")[btn].style.display = "block";
          },false);
        }

        //adding events to the reply buttons, so they can submit replies
        if (reply_submit_btns[btn] != undefined){
          reply_submit_btns[btn].addEventListener("click", function(){

            var comm_ID = replies_btns[btn].dataset.commentId; //comment id to which the user replied to
            var comment_element = document.getElementById("comment-"+comm_ID); //comment element to which the user replied to
            //console.log(comment_element,comm_ID,replies_btns[btn],btn) //debug

            var author_ID = comment_element.dataset.commentAuthorId; //authors id of the comment to which the user replied
            var root_ID = comment_element.dataset.rootId; //root comment id
            var comment = reply_txtboxes[btn].getElementsByClassName("comment-input")[0].value; //comment value

            //console.log(replied_to_user_ID,replied_to_comm_ID,root_ID)
            document.getElementsByClassName("reply-input-wrapper")[btn].style.display = "none";

            if (comment == "" || !comment.replace(/\s/g, '').length){
              comment = " ";
            }

            post_reply(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/submit_reply/"+comment+"/"+article_id+"/"+comm_ID+"/"+author_ID+"/"+root_ID, root_ID);

          },false);
        }

        if (reply_cancel_btns[btn] != undefined){
          reply_cancel_btns[btn].addEventListener("click", function(){
            reply_txtboxes[btn].style.display = "none";
          }, false);
        }

        //DELETE
        //adding events to the delete buttons, so they can open the last warning message box
        if (comments_list_options[btn].getElementsByClassName("comment-delete-btn")[0] != undefined){
          var delete_btn = comments_list_options[btn].getElementsByClassName("comment-delete-btn")[0];
          delete_btn.addEventListener("click", function(){

            document.getElementsByClassName("messege-box-overlay")[0].style.display = "block";
            document.getElementsByClassName("messege-box-wrap")[0].style.display ="block"
            document.getElementsByClassName("messege-box-wrap")[0].style.opacity = "1";

            var comm_ID = this.dataset.commentId; //comment id to which the user replied to

            document.getElementsByClassName("remove-comment-final-warning")[0].dataset.removeId = comm_ID;

          },false);
        }

        //load more replies
        if (comments_list[btn].getElementsByClassName("load-more-replies")[0] != undefined){
          var more_replies_btn = comments_list[btn].getElementsByClassName("load-more-replies")[0];
          more_replies_btn.addEventListener("click", function(){

            var root_ID = this.dataset.rootId; //root comment id
            var order = document.getElementsByClassName("order-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.order;
            //console.log(root_ID,comm_ID,article_id)
            more_replies(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/more_replies/"+root_ID+"/"+article_id+"/"+order, root_ID);

          },false);
        }

        //adding events to the edit buttons, so they can submit replies
        if (comments_list[btn].getElementsByClassName("comment-edit-btn")[0] != undefined){
          var edit_btn = comments_list[btn].getElementsByClassName("comment-edit-btn")[0];
          edit_btn.addEventListener("click", function(){

            if (comments_list[btn].getElementsByClassName("comment-post-body")[0].getElementsByClassName("comment-output")[0] != undefined){

              var comm_ID = this.dataset.commentId; //comment id to which the user replied to
              var comment = comments_list[btn].getElementsByClassName("comment-post-body")[0].getElementsByClassName("comment-output")[0];
              // console.log(comment.parentElement)
              var comment_output = comment.innerHTML;
              var comment_body = comment.parentElement;

              comment_body.innerHTML = "<div class='edit-input-wrapper'><textarea class='comment-input' placeholder='Have something to add to harryM21?.'>"+comment_output+"</textarea><button type='button' class='cancel-edit action__button'>cancel</button><button type='button' data-comment-id='"+comm_ID+"' class='submit-edit action__submit'>Apply</button></div>";

              //comment.parentElement.getElementsByClassName("cancel-edit")[0];
              var edit_cancel_btn = comment_body.getElementsByClassName("cancel-edit")[0];
              var submit_edit_btn = comment_body.getElementsByClassName("submit-edit")[0];

              //cancel button
              edit_cancel_btn.addEventListener("click", function(){
                comment_body.innerHTML = "<p class='comment-output' id='comment-post-manage-2'>"+comment_output+"</p>";
              },false);

              submit_edit_btn.addEventListener("click", function(){
                var edited_comment = comment_body.getElementsByClassName("comment-input")[0].value;
                comment_body.innerHTML = "<p class='comment-output' id='comment-post-manage-2'>"+comment_output+"</p>";

                if (edited_comment == "" || !edited_comment.replace(/\s/g, '').length){
                  edited_comment = " ";
                }

                edit_comment(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/edit_comment/"+comm_ID+"/"+article_id, edited_comment, comm_ID);
              },false);


              console.log("edt")
            }

          },false);
        }

        //upvote
        if (comments_list_options[btn].getElementsByClassName("vote-up-btn")[0] != undefined){
          var upvote_btn = comments_list_options[btn].getElementsByClassName("vote-up-btn")[0];
          upvote_btn.addEventListener("click", function(){

            var comm_ID = this.dataset.commentId; //comment id to which the user replied to

            //console.log(root_ID,comm_ID,article_id)
            vote(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/vote/"+comm_ID+"/"+article_id+"/upvote", comm_ID);

          },false);
        }

        //downvote
        if (comments_list_options[btn].getElementsByClassName("vote-down-btn")[0] != undefined){
          var downvote_btn = comments_list_options[btn].getElementsByClassName("vote-down-btn")[0];
          downvote_btn.addEventListener("click", function(){

            var comm_ID = this.dataset.commentId; //comment id to which the user replied to

            //console.log(root_ID,comm_ID,article_id)
            vote(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/vote/"+comm_ID+"/"+article_id+"/downvote", comm_ID);

          },false);
        }

        /** report **/
        if (comments_list_options[btn].getElementsByClassName("report-btn")[0] != undefined){
          var report = comments_list_options[btn].getElementsByClassName("report-btn")[0];
          report.addEventListener("click", function(){

            var comm_ID = this.dataset.commentId; //comment id to which the user replied to
            document.getElementsByClassName("report-comment-window")[0].style.display = "block";
            document.getElementsByClassName("report-comment-window")[0].getElementsByClassName("fade__out")[0].style.opacity = "1";
            document.getElementsByClassName("submit_comment_report")[0].dataset.removeId = comm_ID;

          },false);
        }
      }
      closure(btn);
    }
  }
}

var resize_triggered = false; //stops the animation on the graph if the user resised the window

function feedback_diagram(xml, animation, width, padding, barPadding){

  function drawLine(ctx, startX, startY, endX, endY, color){
      ctx.save();
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(startX,startY);
      ctx.lineTo(endX,endY);
      ctx.stroke();
      ctx.restore();
  }

  function lighten_color(color){
    if(color.substring(0,1) == '#') {
      color = color.substring(1);
    }

    var rgbColor = {};
    /* Grab each pair (channel) of hex values and parse them to ints using hexadecimal decoding */
    rgbColor.r = parseInt(color.substring(0,2),16);
    rgbColor.g = parseInt(color.substring(2,4),16);
    rgbColor.b = parseInt(color.substring(4),16);

    rgbColor.r = Math.floor(rgbColor.r + (255 - rgbColor.r)*0.3);
    rgbColor.g = Math.floor(rgbColor.g + (255 - rgbColor.g)*0.3);
    rgbColor.b= Math.floor(rgbColor.b + (255 - rgbColor.b)*0.3);

    return "#"+rgbColor.r.toString(16)+rgbColor.g.toString(16)+rgbColor.b.toString(16);
  }

  var myCanvas = document.getElementById("feedback_results");

  myCanvas.width = width;
  myCanvas.height = 300;

  var ctx = myCanvas.getContext("2d");
  var tip = document.getElementsByClassName("feedback-tip")[0];

  ctx.clearRect(0, 0, width, 300); //clearing the canvas

  //storing the rectangle values
  var rects = [],
  i = 0, r;

  var most_votes = Math.max(xml.children[0].innerHTML, xml.children[1].innerHTML, xml.children[2].innerHTML, xml.children[3].innerHTML, xml.children[4].innerHTML, xml.children[5].innerHTML, xml.children[6].innerHTML);
  var nearest = parseInt("5"+"0".repeat(String(most_votes).length-2)); //grid is every 5 10 .. or 50 100 .. or 500 1000 etc)
  var gridScale = Math.floor(most_votes/nearest)*nearest;

  var myVinyls = {
      "Love": xml.children[0].innerHTML,
      "Wow": xml.children[1].innerHTML,
      "Happy": xml.children[2].innerHTML,
      "Funny": xml.children[3].innerHTML,
      "Neutal": xml.children[4].innerHTML,
      "Sad": xml.children[5].innerHTML,
      "Angry": xml.children[6].innerHTML,
  };

  var Barchart = function(options){
      this.options = options;
      this.canvas = options.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.colors = options.colors;
      this.optionsArr = Object.keys(this.options.data);

      this.draw = function(){

          var maxValue = 0;
          for (var categ in this.options.data){
              maxValue = Math.max(maxValue,this.options.data[categ]);
          }
          var canvasActualHeight = this.canvas.height - this.options.padding * 2;
          var canvasActualWidth = this.canvas.width - this.options.padding * 2;

          //drawing the grid lines
          var gridValue = 0;
          while (gridValue <= maxValue){
              var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
              drawLine(
                  this.ctx,
                  0,
                  gridY,
                  this.canvas.width,
                  gridY,
                  this.options.gridColor
              );

              //writing grid markers
              this.ctx.save();
              this.ctx.fillStyle = this.options.gridColor;
              this.ctx.textBaseline="bottom";
              this.ctx.font = "bold 10px Arial";
              this.ctx.fillText(gridValue, 10,gridY - 2);
              this.ctx.restore();

              gridValue+=this.options.gridScale;
          }

          //drawing the bars
          function drawBars(options,optionsArr,ctx,canvas,colors){

              var barIndex = 0;
              var numberOfBars = Object.keys(options.data).length;
              var barSize = (canvasActualWidth)/numberOfBars;

              function drawBarNoAnimation(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
                  ctx.save();
                  ctx.fillStyle=color;
                  ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
                  ctx.restore();

                  var rect_info = {};
                  rect_info["x"] = upperLeftCornerX;
                  rect_info["y"] = upperLeftCornerY;
                  rect_info["w"] = width;
                  rect_info["h"] = height;
                  rect_info["color"] = color;

                  rects.push(rect_info);
              }

              if(animation == false){
                  for (categ in options.data){
                      var val = options.data[categ];
                      var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
                      drawBarNoAnimation(
                          ctx,
                          options.padding + barIndex * barSize + options.barPadding,
                          canvas.height - barHeight - options.padding,
                          barSize - options.barPadding,
                          barHeight,
                          colors[barIndex%colors.length]
                      );

                      barIndex++;
                  }
              }
              else{
                function execute(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color, index){

                  //bars fill animation
                  var numberOfBars = Object.keys(options.data).length;
                  var barSize = (canvasActualWidth)/numberOfBars;
                  var step = 0;

                  function fill(){
                    if (resize_triggered){
                      return;
                    }
                    //drawing the bar in increasing steps
                    ctx.save();
                    ctx.fillStyle=color;
                    ctx.fillRect(upperLeftCornerX,upperLeftCornerY+(height-step),width,step);
                    ctx.restore();

                    var speed = height/15; //grow speed
                    //decreasing the speed on the last bar
                    if(index+1 == optionsArr.length){
                      speed = speed - 0.5;
                    }
                    step += speed;
                    if (step <= height){
                      window.requestAnimationFrame(fill);
                    }
                    else{

                      ctx.save();
                      ctx.fillStyle=color;
                      ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
                      ctx.restore();

                      if(numberOfBars > index){
                        step = 0;
                        index++;
                        var val = options.data[optionsArr[index]];
                        var barHeight = Math.round( canvasActualHeight * val/maxValue) ;

                        var rect_info = {};
                        rect_info["x"] = upperLeftCornerX;
                        rect_info["y"] = upperLeftCornerY;
                        rect_info["w"] = width;
                        rect_info["h"] = height;
                        rect_info["color"] = color;

                        rects.push(rect_info);

                        execute(
                            ctx,
                            options.padding + index * barSize + options.barPadding,
                            canvas.height - barHeight - options.padding,
                            barSize - options.barPadding,
                            barHeight,
                            colors[index%colors.length],
                            index
                        );
                      }
                    }
                  }

                  if (resize_triggered){
                    return;
                  }
                  window.requestAnimationFrame(fill);
                }

                var val = options.data[optionsArr[0]];
                // var val = String(options.data[categ]);
                var barHeight = Math.round( canvasActualHeight * val/maxValue) ;

                execute(ctx,
                        options.padding + 0 * barSize + options.barPadding,
                        canvas.height - barHeight - options.padding,
                        barSize - options.barPadding,
                        barHeight,
                        colors[0%colors.length],
                        0);
              }

              // ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
          }

          drawBars(this.options,this.optionsArr,this.ctx,this.canvas,this.colors);

          //drawing series name
          this.ctx.save();
          this.ctx.textBaseline="bottom";
          this.ctx.textAlign="center";
          this.ctx.fillStyle = "#000000";
          this.ctx.font = "bold 14px Arial";
          this.ctx.fillText(this.options.seriesName, this.canvas.width/2,this.canvas.height);
          this.ctx.restore();

          //draw legend
          barIndex = 0;
          var legend = document.querySelector("legend[for='feedback_results']");
          if (legend.children.length == 0){
            var ul = document.createElement("ul");
            legend.append(ul);
            for (categ in this.options.data){
                var li = document.createElement("li");
                li.style.listStyle = "none";
                li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
                li.style.padding = "5px";
                li.textContent = categ;
                ul.append(li);
                barIndex++;
            }
          }
      }
  }

  myCanvas.onmousemove = function (e) {
      //getting coordinates of the position of the mouse
      var rect = this.getBoundingClientRect(),
          x = Math.floor(e.clientX - rect.left),
          y = Math.floor(e.clientY - rect.top),
          i = 0, r;
      //ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

      //looping through all the rectangles
      while (r = rects[i]) { //changing color on the hovered rectangles

          ctx.beginPath();
          ctx.rect(r.x, r.y, r.w, r.h);
          ctx.fillStyle = ctx.isPointInPath(x,y) ? lighten_color(r.color):r.color; //checking whether the points are on the rectangle
          ctx.fill();

          if(ctx.isPointInPath(x,y)){
            if (!barHit){
              //ctx.font="30px Verdana";
              //ctx.fillText("Big smile!", r.x, r.y);

              tip.getElementsByClassName("feedback-tip-label")[0].innerHTML = String(xml.children[i].nodeName+" "+xml.children[i].innerHTML);
              //console.log(tip);
              tip.style.top = r.y-40+"px";
              tip.style.left = r.x-(44/2)+r.w/2+"px";
              tip.style.display = "block";

              barHit = true;
            }
            break;
          }
          if (rects.length == i+1){
            barHit = false;
            tip.style.display = "none";
          }
          i++;
      }
  };

  var barHit = false; //checking if the mouse hover over a bar

  var myBarchart = new Barchart(
      {
          canvas:myCanvas,
          seriesName:"Feedback",
          padding:padding,
          barPadding:barPadding,
          gridScale: gridScale/2,
          gridColor:"#bbbbbb",
          data:myVinyls,
          colors:["#f442b9", "#ff3535", "#ffe900", "#f4b042","#67b6c7","#3478ff","#bb0a1e"]
      }
  );

  myBarchart.draw();
}

function load_comments(xmlHttp,file_location){
	if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          document.getElementsByClassName("comments")[0].getElementsByClassName("comments-list")[0].innerHTML = this.responseText;
          add_functionality(); //adds events to the comment section
          var display = document.getElementsByClassName("display-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.display;
          if (document.getElementsByClassName("comments_pages_list")[0].children.length == 0){
            comments_pages_indicator(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comm_sect_pages/"+article_id+"/"+display);
          }
        }
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('load_comments(xmlHttp,file_location)',1000);
	}
}

function feedback(xmlHttp,file_location,callback){
	if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          //console.log(this.responseText); //debug
          if (this.responseText != undefined && this.responseText != ""){
            xml = this.responseXML.documentElement;
            // console.log(xml); //debug
            if(xml.children[xml.children.length-1].innerHTML != "none"){

              if (window.innerWidth < 740){
                var width = window.innerWidth - 40 - 130;
                var barPadding = (width/window.innerWidth)*20;
                if (width < 500){
                  feedback_diagram(xml, true, width, 20, barPadding);
                }
              }
              else if(window.innerWidth > 980 && window.innerWidth < 1140){
                feedback_diagram(xml, true, 370, 20, 20*(370/500));
              }
              else{
                feedback_diagram(xml, true, 500, 20, 20);
              }

              document.getElementsByClassName("feedback-options")[0].style.display = "none";
              document.getElementsByClassName("feedback-teaser")[0].innerHTML += "<p>You voted as "+xml.children[xml.children.length-1].innerHTML+"</p>";
            }
            else{
              document.getElementsByClassName("feedback-options")[0].style.display = "block";
            }

            window.addEventListener('resize', function(){

              if (window.innerWidth < 740){
                var width = window.innerWidth - 40 - document.getElementsByClassName("graph_memorandum")[0].offsetWidth;
                var barPadding = (width/window.innerWidth)*20;
                if (width < 500){
                  feedback_diagram(xml, false, width, 20, barPadding);
                }
              }
              else if((window.innerWidth > 980 && window.innerWidth < 1140)){
                feedback_diagram(xml, false, 370, 20, 20*(370/500));
              }
              else if (document.getElementById("feedback_results").width != 500){
                feedback_diagram(xml, false, 500, 20, 20);
              }
              else if(!resize_triggered){
                feedback_diagram(xml, false, 500, 20, 20);
              }
              if(!resize_triggered){
                resize_triggered = true;
              }
            }, false);
          }
          callback();
        }
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('feedback(xmlHttp,file_location)',1000);
	}
}

function more_replies(xmlHttp,file_location, root_id){
	if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)

          //removing the more replies button
          console.log(this.responseText);
          var more_replies_btn = document.getElementById("comment-"+root_id).getElementsByClassName("reply-comments-list")[0].getElementsByClassName("more-replies-btn-"+root_id)[0];
          more_replies_btn.parentElement.removeChild(more_replies_btn);

          document.getElementById("comment-"+root_id).getElementsByClassName("reply-comments-list")[0].innerHTML += this.responseText;
          add_functionality(); //adds events to the comment section
        }
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('load_comments(xmlHttp,file_location)',1000);
	}
}

if(document.getElementsByClassName("submit-comment")[0] != undefined){
  document.getElementsByClassName("submit-comment")[0].addEventListener("click", function(){
    var comment = document.getElementsByClassName("comment-input")[0].value;
    post_comment(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/submit_comment/"+comment+"/"+article_id);
  }, false);
}

function post_comment(xmlHttp,file_location){
	if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          if (this.responseText != undefined){
            document.getElementsByClassName("comments-list")[0].innerHTML = this.responseText + document.getElementsByClassName("comments-list")[0].innerHTML;
          }
          else{
            document.getElementsByClassName("comments-list")[0].innerHTML = "error" + document.getElementsByClassName("comments-list")[0].innerHTML;
          }
          var display = document.getElementsByClassName("display-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.display;
          document.getElementsByClassName("comments_pages_list")[0].innerHTML = "";
          comments_pages_indicator(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comm_sect_pages/"+article_id+"/"+display);
          add_functionality(); //since new comments are added, new comments need to be able to be replied
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('post_comment(xmlHttp,file_location)',1000);
	}
}

function post_reply(xmlHttp, file_location, root_ID){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          var replies_list = document.getElementById("comment-"+root_ID).getElementsByClassName("reply-comments-list")[0];

          if (this.responseText != undefined){
            replies_list.innerHTML = this.responseText + replies_list.innerHTML;
          }
          else{
            replies_list.innerHTML = "Error, could not post your reply. Please, try again." + replies_list.innerHTML;
          }
          add_functionality(); //since new comments are added, new comments need to be able to be replied
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('post_reply(xmlHttp,file_location)',1000);
	}
}

function delete_comment(xmlHttp, file_location, comm_ID){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          var comment_element = document.getElementById("comment-"+comm_ID);

          if (this.responseText != undefined){
            comment_element.parentElement.removeChild(comment_element);
            console.log(this.responseText);
            comment_element.innerHTML = comment_element.innerHTML + this.responseText;
          }
          else{
            comment_element.innerHTML = comment_element.innerHTML + "Error, could not post your reply. Please, try again.";
          }
          add_functionality(); //since new comments are added, new comments need to be able to be replied
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('delete_comment(xmlHttp, file_location, comm_ID)',1000);
	}
}

function edit_comment(xmlHttp, file_location, edited_comment, comm_ID){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location+"/"+edited_comment, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          var comment_element = document.getElementById("comment-"+comm_ID);

          if (this.responseText != undefined){
            //document.getElementById("comment-"+comm_ID).getElementsByClassName("comment-post-body")[0].innerHTML = "<p class='comment-output' id='comment-post-manage-2'>"+edited_comment+"</p>";
            var replies = document.getElementById("comment-"+comm_ID).getElementsByClassName("reply-comments-list")[0];

            //creating a temprary element.
            var temp = document.createElement("div");
            temp.innerHTML = this.responseText;
            if (replies != undefined){
              console.log(temp);
              temp.getElementsByClassName("root-comment-cont")[0].appendChild(replies);
            }
            document.getElementById("comment-"+comm_ID).innerHTML = temp.getElementsByClassName("post")[0].innerHTML;
          }
          else{
            comment_element.innerHTML = comment_element.innerHTML + "Error, could not post your reply. Please, try again.";
          }
          add_functionality(); //since new comments are added, new comments need to be able to be replied
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('delete_comment(xmlHttp, file_location, edited_comment, comm_ID)',1000);
	}
}

function comment_page(comments_nav_el, comments_nav_elements, index){
  var element = document.createElement("li");
  element.className = "comment_page";

  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("data-page", index);
  button.className = "page_btn";

  if (comments_nav_el.children.length == 0 && index == 1){
    button.classList.add("current_page");
  }

  var text_node = document.createTextNode(index);
  button.appendChild(text_node);
  element.appendChild(button);
  comments_nav_el.appendChild(element);

  button.addEventListener('click', function(){
    var order = document.getElementsByClassName("order-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.order;
    var display = document.getElementsByClassName("display-dropdown")[0].getElementsByClassName("button__toggle")[0].dataset.display;
    //console.log(order,display);

    load_comments(xmlHttp,"http://192.168.64.2/mvclearn/blog/ajax/comments/"+article_id+"/"+order+"/"+display+"/"+index);
    for (var list = 0; list < comments_nav_elements.length; list++){
      var comm_page_btns = comments_nav_elements[list].getElementsByClassName("page_btn");

      for (var btn = 0; btn < comm_page_btns.length; btn++){
        comm_page_btns[btn].classList.remove("current_page");
      }
      comments_nav_elements[list].getElementsByClassName("page_btn")[index-1].classList.add("current_page");
    }

    var comments_box = document.getElementsByClassName("comments-wrapper")[0];

    comments_box.scrollIntoView({ block: 'start',  behavior: 'smooth' });

    // button.classList.add("current_page");
    console.log(button);
  }, false);
}

function comments_pages_indicator(xmlHttp, file_location){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          if (this.responseText != undefined){
            var pages = this.responseText
            var comments_pages_lists = document.getElementsByClassName('comments_pages_list');
            for (var list = 0; list < comments_pages_lists.length; list++){
              var comments_nav_el = document.getElementsByClassName('comments_pages_list')[list];
              comments_nav_el.innerHTML = "";
              for (var page = 1; page <= pages; page++){
                comment_page(comments_nav_el, comments_pages_lists, page);
              }
            }
          }
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('delete_comment(xmlHttp, file_location, edited_comment, comm_ID)',1000);
	}
}

function vote(xmlHttp, file_location, comm_ID){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          var comment_element = document.getElementById("comment-"+comm_ID);

          console.log(this.responseText);
          if (this.responseText != undefined){
            if (this.responseText == "like"){
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML) + 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-up-img")[0];
              vote_icon.src = vote_icon.src.replace("vote-up", "voted-up");
            }
            else if(this.responseText == "un-like"){
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML) - 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-up-img")[0];
              vote_icon.src = vote_icon.src.replace("voted-up", "vote-up");
            }
            else if (this.responseText == "dislike"){
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML) + 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-down-img")[0];
              vote_icon.src = vote_icon.src.replace("vote-down", "voted-down");
            }
            else if(this.responseText == "un-dislike"){
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML) - 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-down-img")[0];
              vote_icon.src = vote_icon.src.replace("voted-down", "vote-down");
            }
            else if (this.responseText == "switched-like"){ //if the user already disliked the comment and hit like
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML) - 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-down-img")[0];
              vote_icon.src = vote_icon.src.replace("voted-down", "vote-down");
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML) + 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-up-img")[0];
              vote_icon.src = vote_icon.src.replace("vote-up", "voted-up");
            }
            else if(this.responseText == "switched-dislike"){ //if the user already liked the comment and hit dislike
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-up-votes")[0].innerHTML) - 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-up-img")[0];
              vote_icon.src = vote_icon.src.replace("voted-up", "vote-up");
              document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML = parseInt(document.getElementById("comment-"+comm_ID).getElementsByClassName("total-down-votes")[0].innerHTML) + 1;
              var vote_icon = document.getElementById("comment-"+comm_ID).getElementsByClassName("vote-down-img")[0];
              vote_icon.src = vote_icon.src.replace("vote-down", "voted-down");
            }
          }
          else{
            comment_element.innerHTML = comment_element.innerHTML + "Error, could not post your reply. Please, try again.";
          }
          add_functionality(); //since new comments are added, new comments need to be able to be replied
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('delete_comment(xmlHttp, file_location, edited_comment, comm_ID)',1000);
	}
}

function report(xmlHttp,file_location){
  if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
	  xmlHttp.open("GET", file_location, true); //Creates the request. true is to make the request asynchronous
		//the last parameter is set to false in order for the request to be executed sychronously, so avoid different values to be returned from the XML php file. The reg parameter is used to check whether the sign up button is clicked.
		xmlHttp.onreadystatechange = function(){
      if(this.readyState==4){ //if the oibject is done communicating and response is ready
    		if(this.status==200){ //if communication went ok (so 200 means that communication was successful)
          if (this.responseText != undefined){
            document.getElementsByClassName("report_submitted")[0].style.display = "block";
            document.getElementsByClassName("report_submitted")[0].getElementsByClassName("fade__out")[0].style.opacity = "1";
          }
    		}
    	}
		}
		xmlHttp.send(null); //sends the request ot the server
	}
	else{
		setTimeout('report(xmlHttp, file_location)',1000);
	}
}

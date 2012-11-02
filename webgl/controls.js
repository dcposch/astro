
    $(document).ready(function() {
        // Load data and start webgl visualization
        var nloaded = 0;
        var toLoad = [
            ["solarsystem.json", "json"],
            ["exoplanets_with_radii.json", "json"],
            ["shaders/exoplanet_shader_fs.glsl", "text"],
            ["shaders/exoplanet_shader_vs.glsl", "text"]];
        var loaded = [];
        for(var i = 0; i < toLoad.length; i++){
            (function(){
                var url = ""+toLoad[i][0];
                var j = i;
                $.get(url, function(data){
                    loaded[j] = data;
                    nloaded++;
                    if(nloaded == toLoad.length){
                        doneLoading();
                    }
                }, toLoad[i][1]);
            })();
        }
        function doneLoading(){
            var sd = loaded[0];
            var ed = loaded[1];
            spaceWebGL.shaderSource = {
                'exoplanet_shader_fs':loaded[2],
                'exoplanet_shader_vs':loaded[3]
            };
            spaceWebGL.webGLStart(sd, ed);
            spaceD3.start(sd, ed, spaceWebGL.allBodies);
        }


        $('.zoom-control').selectable({
            selected: function(ev, ui) {
                if(isVisible($('#space-d3'))) {
                    spaceD3.zoomToPlanet();
                }
            }
        });

        // Let user define radius scale, default to 1, the minimum.
        var rslider = $('#radius-multiplier-slider');
        var rvalue = $('#radius-multiplier-value');
        rslider.slider({
            range: "min",
            min: 1,
            max: 50,
            value: 1,
            slide: function(event, ui) {
                rvalue.val(ui.value);
            }
        });
        rvalue.val(rslider.slider("value"));
        rvalue.change(function() {
            var value = rvalue.val();
            if(value < 1) value = 1;
            else if(value > 50) value = 50;
            rvalue.val(value);
            if(value != rslider.slider("value")) {
                rslider.slider("value", value);
            }
        });
        
        // Let user scale distance to see crowded planets better
        var dslider = $('#distance-multiplier-slider');
        var dvalue = $('#distance-multiplier-value');
        dslider.slider({
            range: "min",
            min: 1,
            max: 5000,
            value: 19,
            slide: function(event, ui) {
                dvalue.val(ui.value);
                spaceD3.drawScene();
                //$('.selected-ui').removeClass("selected-ui");
            }
        });
        dvalue.val(dslider.slider("value"));
        dvalue.change(function() {
            var value = dvalue.val();
            if(value < 1) value = 1;
            else if(value > 5000) value = 5000;
            dvalue.val(value);
            if(value != dslider.slider("value")) {
                dslider.slider("value", value);
                spaceD3.drawScene();
                //$('.selected-ui').removeClass("selected-ui");
            }
        });
        

        $('#toggle-view').click(function() {
            // if no webgl support, then no toggle
            if(!spaceWebGL.gl) return;

            if($('#space-webgl').css("display")=="none") {
                $('#space-webgl').show();
                $('#space-webgl').css('display', 'block');
                $('#radius-multiplier').show();

                $('#space-d3').hide();
                $('#distance-multiplier').hide();
                
                // start webgl rendering loop again
                spaceWebGL.tick();
            } else {
                $('#space-webgl').hide();
                $('#radius-multiplier').hide();

                $('#space-d3').show();
                $('#distance-multiplier').show();
            }
        });
        
        $('#space-d3').hide();
        $('#distance-multiplier').hide();
        
        $('#space-webgl').show();
        $('#radius-multiplier').show();
        

    });

    function isVisible(element) {
        return element.css("display")!="none";
    }

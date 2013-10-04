describe("jquery.clientRect", function()
{
    var _cleanEls = [];

    afterEach(function()
    {
        while (_cleanEls.length > 0)
        {
            _cleanEls[0].remove();
            _cleanEls.splice(0, 1);
        }
    });

    var tempEl = function(html)
    {
        var $el = $(html);
        _cleanEls.push($el);
        return $el;
    };

    var basicEl = function()
    {
        return tempEl("<div />")
            .css({ position: "absolute", width: 100, height: 100, top: 100, left: 100 })
            .appendTo("body");
    };

    var rectEquals = function(rect, top, left, width, height)
    {
        var bottom = top + height;
        var right = left + width;
        
        expect(Math.round(rect.top)).to.be(top);
        expect(Math.round(rect.left)).to.be(left);
        expect(Math.round(rect.width)).to.be(width);
        expect(Math.round(rect.height)).to.be(height);
        expect(Math.round(rect.bottom)).to.be(bottom);
        expect(Math.round(rect.right)).to.be(right);
    };

    var testClientRect = function(name, fn)
    {
        it(name, function() { 
            $.support.getBoundingClientRect = true;
            fn(); 
        });

        it(name +  " no getBoundingClientRect", function() { 
            $.support.getBoundingClientRect = false;
            fn(); 
        });
    };

    testClientRect("basic", function() 
    {
        var $el = basicEl();

        var rect = $el.clientRect();

        rectEquals(rect, 100, 100, 100, 100);
    });

    testClientRect("detached element returns 0 rect", function() 
    {
        var $el = basicEl().remove();

        var rect = $el.clientRect();

        rectEquals(rect, 0, 0, 0, 0);

    });

    testClientRect("hidden element returns 0 rect", function() 
    {
        var $el = basicEl().hide();

        var rect = $el.clientRect();

        rectEquals(rect, 0, 0, 0, 0);

    });

    testClientRect("basic with margin", function() 
    {
        var $el = basicEl().css("margin", 10);

        var rect = $el.clientRect();

        rectEquals(rect, 110, 110, 100, 100);

    });

    testClientRect("basic with padding", function() 
    {
        var $el = basicEl().css("padding", 10);

        var rect = $el.clientRect();

        rectEquals(rect, 100, 100, 120, 120);

    });

    testClientRect("basic with border", function() 
    {
        var $el = basicEl().css("border", 10);

        var rect = $el.clientRect();

        rectEquals(rect, 100, 100, 100, 100);

    });

    testClientRect("document element with margin", function() 
    {
        var $el = basicEl();

        $(document).css("margin", 10);

        var rect = $el.clientRect();

        rectEquals(rect, 100, 100, 100, 100);

        $(document).css("margin", 0);
    });


    testClientRect("window scrolled", function() 
    {
        var $el = basicEl();

        // Create a big element so we can scroll the window
        basicEl().css({ height: 1000, width: 1000, position: "absolute" });

        window.scrollTo(150, 150);

        var rect = $el.clientRect();

        rectEquals(rect, 100, 100, 100, 100);

        window.scrollTo(0, 0);
    });

    testClientRect("in element with overflow scroll", function() 
    {
        var $outerEl = basicEl().css({ overflow: "scroll" });

        $("<div />").css({ width: 200, height: 200 }).appendTo($outerEl);

        var $el = $("<div />").css({ width: 20, height: 20 }).appendTo($outerEl);

        $outerEl.scrollTop(50);
        
        var rect = $el.clientRect();

        rectEquals(rect, 250, 100, 20, 20);

    });

});







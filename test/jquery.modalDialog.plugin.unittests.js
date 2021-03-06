/// <reference path="jquery.modalDialog.setup.html" />
/// <reference path="jquery.modalDialog.setup.js" />

describe("Plugins", function () {	
	
	it("should render the plugin modal", function (done) {
		
		var assert = chai.assert;
		
		// add a fake plugin
		$.modalDialog.registerPlugin(function(ModalDialog) {			
			// create the test dialog
			var TestDialog = function () {
				ModalDialog.apply(this, arguments);
			};
			
			$.extend(TestDialog.prototype, ModalDialog.prototype);
	
			TestDialog.prototype.dialogType = "test";
			
			TestDialog.prototype._buildContent = function () {
				this.$content =  $("<div class='dialog-content'>This is a test</div>");
			};
			
			// add an initializer function
			var initializer = function(settings) {
				if(settings.isTest === true) {
					return new TestDialog(settings);
				}
				return null;
			};
			
			return initializer;
		
		}, true);		
		
		// create the dialog of the plugin type
        var dialog = $.modalDialog.create({isTest: true});

        dialog
            .open()
            .then(
                function () {
                    assert.equal($.trim(dialog.$container.find(".dialog-content").text()), "This is a test");
                    return dialog.close();
                })
            .then(done);
    });
	
});
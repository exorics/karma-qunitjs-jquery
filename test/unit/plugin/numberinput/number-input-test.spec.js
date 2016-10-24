QUnit.module("nuber-input cpn test unit", {
    setup: function() {

    },
    teardown: function() {

    }
});
seajs.use(['plugin/numberinput/numberinput'], function() {


    QUnit.test('setValue ', function(assert) {

        assert.ok($().numberInput, "Passed!");

        document.body.focus();
        var fixtures = '<div id="fixtures">\
                    <input id="inputField" type="text" format="amount"/>\
                </div>';
        $('body').append(fixtures);
        $('#inputField').numberInput();

        assert.equal($('#inputField').numberInput("setValue", "222").val(), "222.00");
        assert.equal($('#inputField').numberInput('getValueFormated'), '222.00', 'Passed!');

        // var done = assert.async();

        stop();
        $('#inputField').trigger("focus");

        setTimeout(function() {
            assert.equal(document.activeElement, $('#inputField:first')[0], "Input was focused");
            start();
        },500);

        // $('input:first').val('1');
        stop();

        // $('#inputField').on('change', function() {
        //         console.log(arguments);
        //     })
        var e = $.Event("keypress", { keyCode: 49 });
        $('input:first').trigger(e);

        setTimeout(function() {
            assert.equal(document.activeElement, $('#inputField:first')[0], "Input was focused");
            start();
        },500);

        // stop();
        // $('#inputField').trigger("blur");
        // setTimeout(function() {
        //     assert.equal(document.activeElement, $('#inputField:first')[0], "Input was focused");
        //     start();
        // },500);

        // console.log($('#inputField').val());
        // assert.equal($('#inputField').val(),"1.00");
        $('#fixtures').remove();

    });

    // 
});

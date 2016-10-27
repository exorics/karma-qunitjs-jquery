QUnit.module("nuber-input cpn test unit", {
    setup: function() {

    },
    teardown: function() {

    }
});
seajs.use(['plugin/numberinput/numberinput','plugin/typed'], function() {


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

        $('#inputField').numberInput("setValue", "")
        stop();
        $('#inputField').trigger("focus");

        // setTimeout(function() {
        //     assert.equal(document.activeElement, $('#inputField:first')[0], "Input was focused");
        //     start();
        // },500);

        // $('input:first').val('1');
        console.log($('input'));
        // stop();

        // $('#inputField').on('change', function() {
        //         console.log(arguments);
        //     })
        // var e = $.Event("keypress", { keyCode: 49 });
        // $('input:first').trigger(e);

        $('input').typed({
            strings: ["1"],
            typeSpeed: 0
        });
        setTimeout(function() {
            $('input').blur();
            console.log($('#inputField').val());
            assert.equal($('#inputField').val(),"1.00");
            start();
            $('#fixtures').remove();
        },1500);

        // stop();
        // $('#inputField').trigger("blur");
        // setTimeout(function() {
        //     assert.equal(document.activeElement, $('#inputField:first')[0], "Input was focused");
        //     start();
        // },500);

        // console.log($('#inputField').val());
        // assert.equal($('#inputField').val(),"1.00");
        

    });

    // 
});

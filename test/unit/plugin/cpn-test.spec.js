QUnit.module("Plugin cpn test unit");
seajs.use(['plugin/cpn'], function(cpn) {
    QUnit.test('have defined', function(assert) {
        assert.ok(cpn, "Passed!");
    });

    QUnit.test('reverse', function(assert) {
        assert.ok(cpn.reverse() == true, "Passed!");
    });

    QUnit.test('dd 1+1=2', function(assert) {
        assert.ok(cpn.add(1,1) == 2, "Passed!");
    });
});

function sum(args){
    var total = 0;
    args.forEach(function(int){
        total += int;
    });
    return total;
}

module.exports = {
    sum: sum
};
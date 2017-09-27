$(doucment).off("click",".J-form-switcher").on("click",".J-form-switcher",function(e){
var $this = $(this);
  if($this.find("form-switcher-trigger>i)[0] == e.target){
    return;
                }
                var $checkbox = $this.find("input);
                if($checkbox.prop("checked")){
  $checkbox.prop("checked",false).val(0).trigger("change");
  $this.removeClass("checked")}else{
      $checkbox.prop("checked",true).val(1).trigger("change");
  $this.addClass("checked")
  }
})
$(doucment).off("click",".J-form-checkbox").on("click",".J-form-checkbox",function(e){
var $this = $(this);
  if($this.find("form-switcher-trigger>i)[0] == e.target){
    return;
                }
                var $checkbox = $this.find("input);
                if($checkbox.prop("checked")){
  $checkbox.prop("checked",false).val(0).trigger("change");
  $this.removeClass("checked")}else{
      $checkbox.prop("checked",true).val(1).trigger("change");
  $this.addClass("checked")
  }
})

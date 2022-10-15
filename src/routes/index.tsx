import { component$, useStore, $, useClientEffect$ } from '@builder.io/qwik';

interface IState {
  exp: string;
  tempExp: string;
  pastExp: string;
  chainExp: boolean;
}

export default component$(() => {
  const values: string[] = ['7','8','9','c','4','5','6','*','1','2','3','-','0','=','+','/'];
  const calcState = useStore<IState>({
    exp: '',
    tempExp: '',
    pastExp: '',
    chainExp: false,
  });
  
  const storeOrCalculate = $((param: string) => {
    if (param === '=' || param === 'Enter') { // if value is calculate
      if(calcState.chainExp){
        calcState.exp += calcState.pastExp
      }
      else{
        calcState.pastExp += calcState.tempExp
        calcState.exp += calcState.tempExp
      }
      calcState.tempExp = eval(calcState.exp)
      calcState.chainExp = true;
      console.log(calcState)
    }
    else if(param === 'delete') { // if value is delete
      calcState.tempExp = calcState.tempExp.slice(0,-1);
    }
    else if(param === 'c') { // if value is clear
      calcState.exp = '';
      calcState.tempExp = '';
      calcState.chainExp = false;
    }
    else if(Number(param) || param === '0') { // if value is a number
      if(calcState.chainExp){
        calcState.tempExp = ''
      } 
      calcState.tempExp += param;
      calcState.chainExp = false;
    }
    else { // if value is a sign
      if(calcState.chainExp){
        calcState.exp = calcState.tempExp + param
        calcState.pastExp = param
      }
      else{
        calcState.pastExp += param
        calcState.exp += calcState.tempExp
        calcState.exp += param;
      }
      calcState.tempExp = '';
      calcState.chainExp = false;
    }
    })
    useClientEffect$(() => {
      const handleKeyPress = (e: any) => {
        if(e.key === 'Backspace'){
          storeOrCalculate('delete')
          console.log('silme')
        }
        else if(values.includes(e.key) || e.key === 'Enter'){
          storeOrCalculate(e.key)
        }
      };
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);  
    });

  return (
    <div>
        <h4 class='expression'>{calcState.exp}</h4>
        <div class='input-field'>
          <div id="calculator-display">
            {calcState.tempExp}
          </div>
          <button class='def-btn del-btn' onClick$={() => storeOrCalculate('delete')}>↩</button>
        </div>
      <div class='calc-container'>
        {values.map((x) => <div class="btn-con">
          <button class="def-btn" onClick$={() => storeOrCalculate(x)} value={x}>{x}</button>
        </div>)}
      </div>
    </div>
  );
});


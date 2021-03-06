import React from 'react'
import Link from '../components/Link'
import './Cart.css';
import State from './state'
import { observer } from 'mobx-react';
import {PlusSquare, MinusSquare, XSquare} from 'react-feather'
import atob from 'atob'
import data from '../data.json'
import {GITHUB_USERNAME} from '../PUBLIC_KEY.js'

const URL = `https://api.github.com/repos/${GITHUB_USERNAME}/freemarket/contents/content/settings/stock.json`
const stock = data.inventory[0].inventory
const toDollars = x => parseFloat(x).toFixed(2)

const getInventory = title =>{
  // if there exists an inventory file
  if(
    data.inventory && data.inventory.length &&
    data.inventory.filter(x=>x.name=='inventory').length>0 &&
  // and there exists an entry for this item
    data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==title).length>0
  )
  {
  // return the value there
    return data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==title)[0].value
  }else{
    console.log('error in getInventory() when searching for: '+title)
  }
}

const getStock=item=>{
  const {options,title, trackInventory, trackOptions,selected} = item
  // if we dont track this items stock
  if(!trackInventory && (!trackOptions || options.length<1)){
    return Infinity
  }
  // if we track its options
  if(trackOptions && options.length>0){
    return getInventory(`${title}(${selected})`)
  }
  // if we track it alone
  return getInventory(title)
}

// const getQuantityOfItemInCart=item=>{
//   const {title, selected, trackInventory, trackOptions, options} = item
//   var num = 0
//   // in the case that there are options that stock all together
//   if(trackInventory && !trackOptions && options.length>0){
//     State.getCart().forEach(i=>{
//       if(i.title==title){
//         num += i.quantity
//       }
//     })
//   // but in general we just do this
//   }else{
//     State.getCart().forEach(i=>{
//       if(i.title==title && i.selected==selected){
//         num += i.quantity
//       }
//     })
//   }
//   return num
// }

// const getStock=item=>{
//   // if no selections to worry about
//   if(item.selected==''){
//     if(item.trackInventory){
//       return getInventory(item.title)
//     }else{
//       return -1
//     }
//   }
//   // there is a selection
//   const option = item.options.filter(x=>x.title==item.selected)[0]
//   if(option.separateStock){
//     return getInventory(item.title+'('+option.title+')')
//   } else {
//     if(item.trackInventory){
//       return getInventory(item.title)
//     } else {
//       return -1
// }
// }
  // //if we dont track the item or any options
  // if(!item.trackInventory && (item.options.every(x=>x.separateStock==false)){return -1}
  // //if we dont track the item and
  // if(!item.trackInventory && )
  // var chosenOption = {}
  // if(item.options && item.options.filter(o=>o.title==item.selected).length > 0 ){
  //   chosenOption = item.options.filter(o=>o.title==item.selected)[0]
  // }
  // if(item.selected!='' && chosenOption.separateStock){
  //   const name = ''+item.title+'('+chosenOption.title+')'
  //   // if we have a listing for it
  //   if(data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==name).lenght>0){
  //   // return the value
  //     return data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==name)[0].value
  //   }else{
  //     // else return 0
  //     return 0
  //   }
  // }
  // if(item.trackInventory){
  //   if(data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==item.title).length>0){
  //     data.inventory.filter(x=>x.name=='inventory')[0].inventory.filter(x=>x.title==item.title)[0].value
  //   }else{
  //     return 0
  //   }
  // }else{
  //   return 1
  // }
  // return -1
  // }

const Cart = () =>{
console.log(State.getCart().slice())
return(
  <div className='Cart-Container'>
    <Link to='/store'><div className='Cart-Back'>continue shopping</div></Link>
    {State.cart.length<=0 && 
      <div className='Cart-Empty-Message'>
        Cart is Empty
      </div>
    }
    {State.cart.map((item,i) => 
      <div 
        key={i}
        className='Cart-Line' 
        onClick={(e)=>e.preventDefault()}
      >
        <div 
          className='Cart-Remove' 
          onClick={()=>{State.RFC(i)}}
        >
          <XSquare className='Cart-Feather'/>
        </div>
        <div className='Cart-Item-Name'>
          <div className='Cart-Item-Name-Text'>{item.title}</div>
          {item.selected != ' ' && 
            <div className='Cart-Item-Name-Text' style={{color:'grey'}}>
              {item.selected}
            </div>
          }
        </div>
        <div className='Cart-Quantity-Widget'>
        <div 
            onClick={(e)=>{
              e.preventDefault()
              // if we track this items stock in any way
              if((item.trackInventory || (item.trackOptions && item.options.length>0)) &&
              // and our cart already contains all available stock for it
                getStock(item) < State.getQuantityOfItemInCart(item)+1){
                State.Alert(`sorry we only have ${getStock(item)} in stock `)
                // window.alert(`sorry we only have ${getStock(item)} in stock `)
                // State.modCart(i, item.quantity + getStock(item) - getQuantityOfItemInCart(item))
              }else{
                console.log(getStock(item))
                console.log(State.getQuantityOfItemInCart(item))
                State.modCart(i,item.quantity+1)
              }
            }}
          >
            <PlusSquare size={29} className='Cart-Feather'/>
          </div>
          <div className='Cart-Item-Quantity'>
            <input
              ref={el=>this[i]=el}
              style={{width:`${String(item.quantity).length*8+5}px`,minWidth:'33px', textAlign:'center',height:'25px',margin:'3px',padding:'0px'}}
              value={item.quantity?item.quantity:''}
              onChange={e=>{
                if(getStock(item) < parseInt(e.target.value)||0){
                  State.Alert(`sorry we only have ${getStock(item)} in stock `)
                  // window.alert(`sorry we only have ${getStock(item)} in stock `)
                }else{
                  State.modCart(i,parseInt(e.target.value)||0)
                }
              }}
              onKeyPress={e=>e.key==='Enter'&&this[i].blur()}
            />
          </div>
          <div 
            onClick={(e)=>{
              e.preventDefault()
              item.quantity>1&& State.modCart(i,item.quantity-1)
            }}
          >
            <MinusSquare size={29} className='Cart-Feather'/>
          </div>
        </div>
        <div className='Cart-Item-Price'>${toDollars(item.price*item.quantity)}</div>
      </div>
    )} 
    <div className='Cart-Footer'>
      <div className='Cart-Footer-Total'>
        TOTAL : ${toDollars(State.getTotal())}
      </div>
      <Link to='/checkout'>
        <div className='Cart-Footer-Checkout'>
          checkout
        </div>
      </Link>
    </div>
  </div>
)}
export default observer(Cart)
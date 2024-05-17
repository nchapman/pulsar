import{C as m,B as t,c as a}from"./Button-CxH3AEDB.js";import"./compat.module-CAUz7a36.js";import{u as n}from"./jsxRuntime.module-Dwme6zuK.js";import"./Logo-BQcSdfXk.js";import"./Text-Dst21N43.js";import{w as i}from"./preact.module-BeXc_rzl.js";import"./classNames-CTaYpvhF.js";import"./_commonjsHelpers-BosuxZz1.js";const C={title:"shared/ConfirmModal",component:m},o={decorators:e=>n(i,{children:[n(t,{variant:"primary",onClick:()=>a({type:"danger",confirmText:"Delete",title:"Are you sure?",message:"This action cannot be undone.",onConfirm:()=>{}}),children:"Open modal"}),n(e,{})]})},r={decorators:e=>n(i,{children:[n(t,{variant:"primary",onClick:()=>a({type:"info",confirmText:"Confirm",title:"Are you sure?",message:"This action cannot be undone.",onConfirm:()=>{}}),children:"Open modal"}),n(e,{})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: (Story: any) => <>
      <Button variant="primary" onClick={() => confirm({
      type: 'danger',
      confirmText: 'Delete',
      title: 'Are you sure?',
      message: 'This action cannot be undone.',
      onConfirm: () => undefined
    })}>
        Open modal
      </Button>
      <Story />
    </>
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  decorators: (Story: any) => <>
      <Button variant="primary" onClick={() => confirm({
      type: 'info',
      confirmText: 'Confirm',
      title: 'Are you sure?',
      message: 'This action cannot be undone.',
      onConfirm: () => undefined
    })}>
        Open modal
      </Button>
      <Story />
    </>
}`,...r.parameters?.docs?.source}}};const g=["Danger","Info"];export{o as Danger,r as Info,g as __namedExportsOrder,C as default};

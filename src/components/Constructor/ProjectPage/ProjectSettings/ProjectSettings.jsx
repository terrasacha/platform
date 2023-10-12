import React, { useState, useEffect} from "react";
import { Auth } from "aws-amplify";
import s from '../css/ProjectSettings.module.css'
import ProjectSettingsCard from "./SettingCards/ProjectSettingsCard";
import TokenSettingsCard from "./SettingCards/TokenSettingsCard";
import CashFlowSettings from "./SettingCards/CashFlowSettings";
import GenericInputTable from "./SettingCards/GenericInputTable";
import DescriptionValidator from "./SettingCards/DescriptionValidator";

export default function ProjectSettings() {
  const [activeSection, setActiveSection] = useState('technical');  
  const [validatorSubRole, setValidatorSubRole] = useState("");

  useEffect(() => { 
    Auth.currentAuthenticatedUser()
    .then(data =>{
      if(data.attributes['custom:subrole']){
        console.log(data.attributes['custom:subrole'])
        setValidatorSubRole(data.attributes['custom:subrole'])
      }else{
        setValidatorSubRole(undefined)
      }
    })
    .catch(error =>setValidatorSubRole(undefined))
  }, [])
  return (
    <div className="row row-cols-1  g-4">
      <div className="col">
        <ProjectSettingsCard />
      </div>
      <div className={s.selectSettingTypeContainer}>
        <button 
        className={`${s.selectSettingType} ${activeSection === 'technical' ? s.selectSettingTypeActive : ''}`}
        onClick={() => setActiveSection('technical')}>Configuración técnica</button>
        <button 
        className={`${s.selectSettingType} ${activeSection === 'financial' ? s.selectSettingTypeActive : ''}`}
        onClick={() => setActiveSection('financial')}>Configuración financiera</button>
      </div>
      {activeSection === 'technical' &&
        <>
          <div className="col">
            <DescriptionValidator canEdit={activeSection !== validatorSubRole}/>
          </div>
          <div className="col">
            <GenericInputTable canEdit={activeSection !== validatorSubRole} title={'Ingresos por producto'} fID={'GLOBAL_INGRESOS_POR_PRODUCTO'} financialInfoType={'revenuesByProduct'}/>
          </div>
          <div className="col">
            <GenericInputTable  canEdit={activeSection !== validatorSubRole} title={'Productos del ciclo del proyecto'} fID={'GLOBAL_PRODUCTOS_DEL_CICLO_DE_PROYECTO'} financialInfoType={'productsOfCycleProject'}/>
          </div>
        </>
      }
      {activeSection === 'financial' &&
        <>
          <div className="col">
            <TokenSettingsCard canEdit={activeSection !== validatorSubRole}/>
          </div>
          <div className="col">
            <CashFlowSettings  canEdit={activeSection !== validatorSubRole}/>
          </div>
        </>
      }
     
    </div>
  );
}

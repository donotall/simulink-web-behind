import request from '@/utils/request'
const api = "/simulink"
export default {
  getXpcConnection(id,connectId,port) {
        return request({
            url: `${api}/connect/${id}/${connectId}/${port}`,
            method: 'get'
        })
   },
   unLinkXpc(id,port){
        return request({
            url: `${api}/close/${id}/${port}`,
            method: 'get'
        })
   },
   getSetting(port){
        return request({
            url: `${api}/getSetting/${port}`,
            method: 'get'
        })
   },
   ChangeTargetSetting(port,fileName,targetSettingVo){
    return request({
        url: `${api}/changeSetting/${fileName}/${port}`,
        method: 'put',
        data: targetSettingVo
    })
   },  
   startSimulink(port){
    return request({
        url: `${api}/startModel/${port}`,
        method: 'get'
    })
   },
   stopSimulink(port){
    return request({
        url: `${api}/stop/${port}`,
        method: 'get'
    })
   },
   getSimulinkData(port){
    return request({
        url: `${api}/data/getData/${port}`,
        method: 'get'
    })
   },
   loadingModel(fileName,port){
    return request({
        url: `${api}/xpcLoad/${fileName}/${port}`,
        method: 'get'
    })
   }
}
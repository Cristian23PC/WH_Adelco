# File Structure

This structure help you get familiar with projects quickly.

```
.
├── app.config.ts                 
├── app.controller.ts             
├── app.module.ts                 
├── common                        
│   ├── constants                  
│   ├── adapters                  
│   ├── decorator                 
│   ├── exceptions                
│   ├── filters                   
│   ├── guard                     
│   ├── interceptors              
│   ├── middlewares               
│   ├── utils               
│   ├── validators               
│   └── pipes                     
├── config   
├── database
│   ├── migrations
│   └── seeders
│       ├── addresses
│       └── users 
├── environments
│   ├── config.local.json                 
│   ├── config.dev.json                   
│   └── config.staging.json   
├── main
│   ├── app.controller.ts                
│   ├── app.module.ts                  
│   └── app.service.ts                                     
├── modules
│   └── auth
│       ├── services
│       ├── controllers
│       ├── dto
│       ├── payload
│       └── enums                
│   ├── app.module.ts                  
│   └── app.service.ts                         
├── main.ts                     
├── main.hmr.ts                                                                              
```

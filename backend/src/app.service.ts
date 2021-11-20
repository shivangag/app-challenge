import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloChallenge(): string {
    return 'Hello Challenge!';
  }

  getChallenge(): string {
    return '<b>Nest.js backend challenge  </b></br>  \
            </br> Add WSS Feature  to simple <b>REST api</b> with crud endpoints with a postgres database </br> \
            </br> Extend the current app with WSS channel for pub/sub  </br>\
            </br> Authorized frontend Clients can register for update events on resoure "restaurants"  </br>\
            </br> On every CRUP operation the frontend client shall get an notification with payload on change resource over wss</br> \
            </br> Refactor default nest.js logging with an winston-aws-cloudwatch   </br> \
            </br> each log record fits in one line , parsable json structure   </br> \
            </br> document your new api endpoints with openapi/Swagger    </br>\
            </br> modify unit and e2e test with mock data  </br>\
             ';
  }
}

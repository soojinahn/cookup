
<div align="center">
<img width="200" alt="Main logo" src="https://github.com/soojinahn/cookup/blob/main/frontend/src/components/styles/logo.png">
<br>
<br>

[![MERN Stack](https://skillicons.dev/icons?i=mongodb,express,nodejs,react)](https://skillicons.dev)
</div>

# CookUp

저희 개발팀은 브라우저에서 접근 가능한 요리 및 베이킹 레시피 공유 플랫폼을 제공하는 것을 목표로 했습니다. 쿡업은 사람들이 레시피를 게시하고 공유할 수 있는 공간을 제공하며, 관심사와 니즈에 맞는 커뮤니티 페이지를 찾을 수 있도록 돕습니다.

## 사용 기술 📚
**개요:** Express와 Node.js를 백엔드로, ReactJS를 프론트엔드로 사용해 웹 애플리케이션을 구축했습니다. 이 앱은 Twilio를 통한 SMS 로그인 기능을 제공하며, Docker와 Heroku를 사용해 배포되었습니다.

*(현재 Heroku가 유료 서비스로 전환되어 배포 링크가 작동하지 않습니다.)*


**Frontend:** ReactJS, HTML, CSS, Bulma\
**Backend:** Express.js, Node.js, MongoDB\
**Tools:** Twilio, Heroku, Docker\
**Others:** AWS Cloud9 (IDE), Git, GitHub

## 기능 ✨
- Login and authentication: 2단계 (SMS) 인증을 통해 로그인하고 앱 내에서 신원 확인
- Feed Creation: 모든 사용자가 볼 수 있는 레시피 생성 
- Post Interaction: 게시물에 좋아요 및 댓글 달기 가능 
- Search: 레시피의 재료 또는 사용자를 기반으로 검색 및 탐색
- Tag Page: 특정 태그(예: 비건, 채식, 락토스 프리) 생성과 태그로 레시피 조회
- User Page: 자신이 생성한 모든 레시피 확인 가능 

## 내가 기여한 부분 👩🏼‍💻 

- **태그**:
    - Frontend:
        - User Page
            - 팔로우 중인 태그 목록 표시
            - 팔로우 중인 태그 삭제 버튼
        - Feed Creation
            - Create Recipe Modal에 태그 목록 생성 기능
            - 업로드 후 레시피에 태그 표시
            - '+' 클릭 시 태그 팔로우 가능
    - Backend:
        - Tag Model (CRUD)
            - 새로운 태그 생성, 태그 표시 (CREATE, SELECT)
            - 태그 삭제, 태그 수정 (DELETE, UPDATE)
        - User Model (CRUD)
            - 태그 팔로우/언팔로우 (CREATE, DELETE)

- **레시피, 피드**:
    - Frontend:
        - Feed Creation
            - 레시피 수정, 삭제 버튼
        - User Page
            - 피드 필터링
    - Backend:
        - Tag Model (Filtering)
            - findBySearch - 검색창 태그 검색
            - findByName - 태그 페이지 클릭
        - Recipe Model (Filtering)
            - findByUser - 유저 페이지

- **UI**:
    - Bulma로 UI 개선
    - Adobe Photoshop으로 로고 제작

## 코드 Snippets 👾

### 1. DB Tag Model

~~~javascript
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxLength: 250,
  },
  followers: {
    type: Number,
    default: 0,
  },
}, { timestamps: { createdAt: 'created_at' } });

tagSchema.index({
  name: 'text',
  description: 'text',
},
{
  weights: {
    name: 3,
    description: 1,
  },
  name: 'tag_text',
});
~~~
- Tag 데이터베이스 스키마

### 2: DB Tag Model, Filtering

~~~javascript
tagSchema.statics.findBySearch = function (query) {
  return this.find({ $text: { $search: query } });
};

tagSchema.statics.findByName = function (query) {
  return this.findOne({ name: query });
};

tagSchema.methods.getPostCount = async function () {
  const res = await mongoose.model('Recipe').countDocuments({ tags: this.name });
  return res;
};
~~~
- 피드 filtering때 필요한 query callback function

### 3. DB Tag Route, 팔로우
~~~javascript
const router = new Router();

router.post('/', async (ctx) => {
    const { session } = ctx;
    const { following: newTag } = ctx.request.body;
    ctx.body = {};

    const user = await User.findByLogin(session.user);
    // if user not found
    if(!user) {  
    ctx.body.success = false;
    return;
    }

    // find the user by name and update push new tag to 'following' array
    try {
    await User.update(
        { _id: user._id },
        { '$push': { following: newTag.tag } },
    );
    } catch (err) {
    console.log(err);
    ctx.body.success = false;
    return;
    }

    ctx.body.success = true;
    });

module.exports = router.routes();
~~~

- 사용자가 태그를 새로 '팔로우'할 때 유저 데이터 업데이트


# Screenshots

<div align="center">
<img alt="Create recipe" src="https://github.com/soojinahn/cookup/blob/main/frontend/src/components/styles/createRecipe.jpg">

*Figure 1. Create Recipe modal*

<br>

<img width= "60%" alt="Recipe feed" src="https://github.com/soojinahn/cookup/blob/main/frontend/src/components/styles/recipeFeed.jpg">

*Figure 2. Recipe display in feed*

</div>

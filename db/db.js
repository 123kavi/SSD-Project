
const mongoose =require('mongoose')
mongoose.connect("mongodb+srv://kaviravihansi1:m84BZh2vXtcCRij6@cluster0.n31wihn.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
})
  .then(()=>{
      console.log(`Data is connect sucessfully`)
  })
  .catch((err)=>{
      console.log('Not connnected',err)
  })

module.exports  = mongoose 
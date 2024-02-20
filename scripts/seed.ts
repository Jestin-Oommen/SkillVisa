const {PrismaClient}= require("@prisma/client")

const database=new PrismaClient();

async function main(){
    try{
        await database.category.createMany({
            data:[
                {name:"Computer Science"},
                {name:"Music"},
                {name:"Filming"},
                {name:"Cooking"},
                {name:"Fitness"},
                {name:"Engineering"},
                {name:"Gaming"},
                {name:"Other"}
            ]
        })
        console.log("Database seeded successfully")
        
    }
    catch(error){
        console.log("Error seeding the database category",error)

    }
    finally{
        await database.$disconnect()
    }

}

main();


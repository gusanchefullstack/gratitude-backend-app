import { prisma } from "../lib/prisma";

async function main() {
  const grace1 = await prisma.gratitude.upsert({
    where: { title: "Gracias a Dios por mi familia" },
    update: {},
    create: {
      title: "Gracias a Dios por mi familia",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pellentesque odio in varius laoreet. Pellentesque lobortis aliquam magna et posuere. Phasellus consectetur metus ut pretium tincidunt. Sed eu sapien eu risus dignissim accumsan egestas in turpis. Vestibulum eleifend ipsum sed lectus rutrum, eu imperdiet libero tristique. Nunc auctor, quam ac",
      tags: ["love", "health", "family", "wife", "abundance"],
    },
  });
  const grace2 = await prisma.gratitude.upsert({
    where: { title: "Gracias a Dios por mi hogar" },
    update: {},
    create: {
      title: "Gracias a Dios por mi hogar",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pellentesque odio in varius laoreet. Pellentesque lobortis aliquam magna et posuere. Phasellus consectetur metus ut pretium tincidunt. Sed eu sapien eu risus dignissim accumsan egestas in turpis. Vestibulum eleifend ipsum sed lectus rutrum, eu imperdiet libero tristique. Nunc auctor, quam ac",
      tags: ["love", "health", "family", "wife", "abundance"],
    },
  });
  const grace3 = await prisma.gratitude.upsert({
    where: { title: "Gracias a Dios por mi casa" },
    update: {},
    create: {
      title: "Gracias a Dios por mi casa",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pellentesque odio in varius laoreet. Pellentesque lobortis aliquam magna et posuere. Phasellus consectetur metus ut pretium tincidunt. Sed eu sapien eu risus dignissim accumsan egestas in turpis. Vestibulum eleifend ipsum sed lectus rutrum, eu imperdiet libero tristique. Nunc auctor, quam ac",
      tags: ["love", "health", "family", "wife", "abundance"],
    },
  });
  const grace4 = await prisma.gratitude.upsert({
    where: { title: "Gracias a Dios por mi trabajo" },
    update: {},
    create: {
      title: "Gracias a Dios por mi trabajo",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pellentesque odio in varius laoreet. Pellentesque lobortis aliquam magna et posuere. Phasellus consectetur metus ut pretium tincidunt. Sed eu sapien eu risus dignissim accumsan egestas in turpis. Vestibulum eleifend ipsum sed lectus rutrum, eu imperdiet libero tristique. Nunc auctor, quam ac",
      tags: ["love", "health", "family", "wife", "abundance"],
    },
  });
  const grace5 = await prisma.gratitude.upsert({
    where: { title: "Gracias a Dios por conocer Egipto" },
    update: {},
    create: {
      title: "Gracias a Dios por conocer Egipto",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pellentesque odio in varius laoreet. Pellentesque lobortis aliquam magna et posuere. Phasellus consectetur metus ut pretium tincidunt. Sed eu sapien eu risus dignissim accumsan egestas in turpis. Vestibulum eleifend ipsum sed lectus rutrum, eu imperdiet libero tristique. Nunc auctor, quam ac",
      tags: ["love", "health", "family", "wife", "abundance"],
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import debug from 'debug';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';

const logger = debug('initDB');

(async () => {
  /* @ts-ignore */
  const orm = await MikroORM.init(mikroOrmConfig);
  const generator = orm.getSchemaGenerator();

  const dropDump = await generator.getDropSchemaSQL();
  logger('DROP SQL:', dropDump);

  const createDump = await generator.getCreateSchemaSQL();
  logger('CREATE SQL:', createDump);

  const updateDump = await generator.getUpdateSchemaSQL();
  logger('UPDATE SQL:', updateDump);

  // there is also `generate()` method that returns drop + create queries
  const dropAndCreateDump = await generator.generate();
  logger('DROP AND CREATE SQL:', dropAndCreateDump);

  // or you can run those queries directly, but be sure to check them first!
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  await orm.close(true);

  logger("JOB'S DONE!");
})();

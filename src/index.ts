import parseRequest from './parse-request'
import ParseSchema from './parse-schema'
import * as minimist from 'minimist'
import * as fs from 'fs-extra'

const argv = minimist(process.argv.slice(2))

function getArgumentOrDie (name: string): any {
  const arg = argv[name]
  if (arg) {
    return arg
  } else {
    console.error(`Missing argument ${name}`)
    process.exit(1)
  }
}

const appId: string = getArgumentOrDie('appId')
const masterKey: string = getArgumentOrDie('masterKey')
const serverURL: string = getArgumentOrDie('serverURL')

if (argv.import) {
  if (argv.file) {
    importSchemas(argv.file)
  } else {
    console.error('Missing argument file')
  }
} else if (argv.export) {
  exportSchemas(argv.file)
} else {
  console.error('Invalid script call')
  process.exit(1)
}

async function exportSchemas (file?: string) {
  const schemas = await parseRequest(serverURL, appId, masterKey, 'GET', `schemas`)
  if (file) {
    await fs.writeFile(file, JSON.stringify(schemas.results, null, 4))
  } else {
    console.log(schemas.results)
  }
}

async function importSchemas (file: string) {
  // Fetch schema from file
  let schemas: [ParseSchema] = null!
  try {
    schemas = await fs.readJson(file)
  } catch (error) {
    console.error(`Could not read JSON file at path ${file}`)
    process.exit(1)
  }

  // Parse file
  for (const schema of schemas) {
    // Delete the existing class
    await parseRequest(serverURL, appId, masterKey, 'DELETE', `schemas/${schema.className}`)

    // Add the class
    const cleanSchema: ParseSchema = Object.assign({}, schema)
    delete cleanSchema.fields['objectId']
    delete cleanSchema.fields['createdAt']
    delete cleanSchema.fields['updatedAt']
    delete cleanSchema.fields['ACL']

    if (cleanSchema.className === '_User') {
      delete cleanSchema.fields['username']
      delete cleanSchema.fields['password']
      delete cleanSchema.fields['email']
      delete cleanSchema.fields['emailVerified']
      delete cleanSchema.fields['authData']
    }

    if (cleanSchema.className === '_Role') {
      delete cleanSchema.fields['name']
      delete cleanSchema.fields['users']
      delete cleanSchema.fields['roles']
    }

    await parseRequest(serverURL, appId, masterKey, 'POST', `schemas/${schema.className}`, cleanSchema)
  }
}

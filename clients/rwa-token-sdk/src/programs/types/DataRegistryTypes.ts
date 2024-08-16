/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/data_registry.json`.
 */
export type DataRegistry = {
  "address": "dataeP5X1e7XsWN1ovDSEDP5cqaEUnKBmHE5iZhXPVw",
  "metadata": {
    "name": "dataRegistry",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Data Registry Program (DRP) enables the ledger of generic asset data.",
    "repository": "https://github.com/bridgesplit/rwa"
  },
  "instructions": [
    {
      "name": "createDataAccount",
      "docs": [
        "data functions",
        "create data account"
      ],
      "discriminator": [
        129,
        132,
        92,
        50,
        136,
        89,
        37,
        100
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "dataRegistry"
        },
        {
          "name": "dataAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createDataAccountArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createDataRegistry",
      "docs": [
        "registry functions",
        "create data registry"
      ],
      "discriminator": [
        206,
        245,
        133,
        230,
        73,
        246,
        116,
        101
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "assetMint"
        },
        {
          "name": "dataRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "assetMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "pubkey"
        },
        {
          "name": "delegate",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "delegateDataRegsitry",
      "docs": [
        "delegate data registry"
      ],
      "discriminator": [
        173,
        92,
        229,
        22,
        152,
        104,
        168,
        224
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "dataRegistry",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "delegate",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "deleteDataAccount",
      "docs": [
        "delete data account"
      ],
      "discriminator": [
        159,
        5,
        34,
        220,
        166,
        192,
        76,
        92
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "dataRegistry"
        },
        {
          "name": "dataAccount",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "updateDataAccount",
      "docs": [
        "update data account"
      ],
      "discriminator": [
        90,
        215,
        94,
        10,
        209,
        249,
        11,
        148
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "dataRegistry"
        },
        {
          "name": "dataAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateDataAccountArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "dataAccount",
      "discriminator": [
        85,
        240,
        182,
        158,
        76,
        7,
        18,
        233
      ]
    },
    {
      "name": "dataRegistryAccount",
      "discriminator": [
        57,
        174,
        76,
        239,
        133,
        18,
        173,
        209
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorizedSigner",
      "msg": "The signer is not authorized to perform this action"
    }
  ],
  "types": [
    {
      "name": "createDataAccountArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "type",
            "type": {
              "defined": {
                "name": "dataAccountType"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "dataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "dataRegistry",
            "docs": [
              "data registry to which the account belongs"
            ],
            "type": "pubkey"
          },
          {
            "name": "type",
            "docs": [
              "type of the data account"
            ],
            "type": {
              "defined": {
                "name": "dataAccountType"
              }
            }
          },
          {
            "name": "name",
            "docs": [
              "used by creator to store name of the document"
            ],
            "type": "string"
          },
          {
            "name": "uri",
            "docs": [
              "uri pointing to the data stored in the document"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "dataAccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "title"
          },
          {
            "name": "legal"
          },
          {
            "name": "tax"
          },
          {
            "name": "miscellaneous"
          }
        ]
      }
    },
    {
      "name": "dataRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "can sign creation of new data accounts",
              "can update delegate",
              "can update data account authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "can sign creation of new data accounts, can be used if a different org needs to issue data accounts"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateDataAccountArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "type",
            "type": {
              "defined": {
                "name": "dataAccountType"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    }
  ]
};

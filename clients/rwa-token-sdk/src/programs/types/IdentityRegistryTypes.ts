/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/identity_registry.json`.
 */
export type IdentityRegistry = {
  "address": "idtynCMYbdisCTv4FrCWPSQboZb1uM4TV2cPi79yxQf",
  "metadata": {
    "name": "identityRegistry",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Identity Registry Program (IRP) manages the configurable issuance and tracking of on-chain identities to enable on-chain transaction permissioning.",
    "repository": "https://github.com/bridgesplit/rwa"
  },
  "instructions": [
    {
      "name": "addLevelToIdentityAccount",
      "docs": [
        "add level to identity account"
      ],
      "discriminator": [
        102,
        204,
        64,
        169,
        252,
        177,
        192,
        232
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
          "name": "identityRegistry"
        },
        {
          "name": "identityAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "identityRegistry"
              },
              {
                "kind": "account",
                "path": "identity_account.owner",
                "account": "identityAccount"
              }
            ]
          }
        },
        {
          "name": "identityMetadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createIdentityAccount",
      "docs": [
        "identity functions",
        "create identity account"
      ],
      "discriminator": [
        82,
        240,
        35,
        129,
        113,
        134,
        116,
        70
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
          "name": "identityRegistry"
        },
        {
          "name": "identityAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "identityRegistry"
              },
              {
                "kind": "arg",
                "path": "owner"
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
          "name": "owner",
          "type": "pubkey"
        },
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createIdentityRegistry",
      "docs": [
        "registry functions",
        "create identity registry"
      ],
      "discriminator": [
        180,
        3,
        39,
        22,
        183,
        212,
        39,
        209
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
          "name": "identityRegistryAccount",
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
      "name": "delegateIdentityRegsitry",
      "docs": [
        "delegate identity registry"
      ],
      "discriminator": [
        29,
        162,
        167,
        70,
        52,
        79,
        50,
        65
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "identityRegistryAccount",
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
      "name": "editIdentityMetdata",
      "docs": [
        "edit identity metadata"
      ],
      "discriminator": [
        140,
        213,
        200,
        29,
        44,
        134,
        114,
        206
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
          "name": "identityRegistry"
        },
        {
          "name": "identityMetadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "level",
          "type": "u8"
        },
        {
          "name": "maxAllowed",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "removeLevelFromIdentityAccount",
      "docs": [
        "remove level from identity account"
      ],
      "discriminator": [
        194,
        231,
        187,
        54,
        197,
        136,
        170,
        55
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
          "name": "identityRegistry"
        },
        {
          "name": "identityAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "identityRegistry"
              },
              {
                "kind": "account",
                "path": "identity_account.owner",
                "account": "identityAccount"
              }
            ]
          }
        },
        {
          "name": "identityMetadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "level",
          "type": "u8"
        }
      ]
    },
    {
      "name": "revokeIdentityAccount",
      "docs": [
        "revoke user identity account by closing account"
      ],
      "discriminator": [
        77,
        88,
        182,
        61,
        235,
        49,
        2,
        137
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
          "name": "identityRegistry",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "identity_registry.asset_mint",
                "account": "identityRegistryAccount"
              }
            ]
          }
        },
        {
          "name": "identityAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "identityRegistry"
              },
              {
                "kind": "account",
                "path": "identity_account.owner",
                "account": "identityAccount"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "owner",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identityAccount",
      "discriminator": [
        194,
        90,
        181,
        160,
        182,
        206,
        116,
        158
      ]
    },
    {
      "name": "identityMetadataAccount",
      "discriminator": [
        170,
        131,
        34,
        74,
        232,
        122,
        201,
        9
      ]
    },
    {
      "name": "identityRegistryAccount",
      "discriminator": [
        154,
        254,
        118,
        4,
        115,
        36,
        125,
        78
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "levelAlreadyPresent",
      "msg": "Identity level has already been attached to user"
    },
    {
      "code": 6001,
      "name": "maxLevelsExceeded",
      "msg": "Number of levels that can be attached to user has been exceeded"
    },
    {
      "code": 6002,
      "name": "levelNotFound",
      "msg": "Level to be removed not found"
    },
    {
      "code": 6003,
      "name": "unauthorizedSigner",
      "msg": "Unauthorized signer"
    },
    {
      "code": 6004,
      "name": "limitReached",
      "msg": "Identity limit reached"
    }
  ],
  "types": [
    {
      "name": "identityAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version of the account"
            ],
            "type": "u8"
          },
          {
            "name": "identityRegistry",
            "docs": [
              "identity registry to which the account belongs"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "owner of the identity account"
            ],
            "type": "pubkey"
          },
          {
            "name": "levels",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "identityMetadataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version of the account"
            ],
            "type": "u8"
          },
          {
            "name": "identityRegistry",
            "docs": [
              "identity registry to which the account belongs"
            ],
            "type": "pubkey"
          },
          {
            "name": "level",
            "docs": [
              "identity level"
            ],
            "type": "u8"
          },
          {
            "name": "currentUsers",
            "docs": [
              "current number of users"
            ],
            "type": "u64"
          },
          {
            "name": "maxUsers",
            "docs": [
              "max number of users"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "identityRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "corresponding asset mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority to manage the registry"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "registry delegate"
            ],
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};

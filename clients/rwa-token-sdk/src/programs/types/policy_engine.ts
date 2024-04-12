/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/policy_engine.json`.
 */
export type PolicyEngine = {
  "address": "po1cPf1eyUJJPqULw4so3T4JU9pdFn83CDyuLEKFAau",
  "metadata": {
    "name": "policyEngine",
    "version": "0.0.1",
    "spec": "0.1.0",
    "description": "The Policy Registry Program (PRP) enables the creation of policies that can be used to control the flow of funds in a programmatic way."
  },
  "instructions": [
    {
      "name": "attachToPolicyAccount",
      "docs": [
        "attach a policy"
      ],
      "discriminator": [
        247,
        116,
        130,
        17,
        89,
        232,
        103,
        16
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
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
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
          "name": "identityFilter",
          "type": {
            "defined": {
              "name": "identityFilter"
            }
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": {
              "name": "policyType"
            }
          }
        }
      ]
    },
    {
      "name": "createPolicyAccount",
      "docs": [
        "policies",
        "create policy account"
      ],
      "discriminator": [
        52,
        228,
        143,
        138,
        102,
        135,
        59,
        193
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
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
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
          "name": "identityFilter",
          "type": {
            "defined": {
              "name": "identityFilter"
            }
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": {
              "name": "policyType"
            }
          }
        }
      ]
    },
    {
      "name": "createPolicyEngine",
      "docs": [
        "create a policy registry"
      ],
      "discriminator": [
        85,
        105,
        207,
        153,
        73,
        125,
        225,
        54
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "assetMint"
        },
        {
          "name": "policyEngine",
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
      "name": "detachFromPolicyAccount",
      "docs": [
        "remove policy"
      ],
      "discriminator": [
        81,
        24,
        116,
        10,
        12,
        108,
        109,
        242
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
          "name": "policyEngine",
          "writable": true
        },
        {
          "name": "policyAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "policyEngine"
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
          "name": "hash",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "policyAccount",
      "discriminator": [
        218,
        201,
        183,
        164,
        156,
        127,
        81,
        175
      ]
    },
    {
      "name": "policyEngineAccount",
      "discriminator": [
        124,
        85,
        205,
        80,
        2,
        18,
        26,
        45
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPolicy",
      "msg": "Invalid policy passed"
    },
    {
      "code": 6001,
      "name": "transactionAmountLimitExceeded",
      "msg": "Transaction amount limit exceeded"
    },
    {
      "code": 6002,
      "name": "transactionAmountVelocityExceeded",
      "msg": "Transaction amount velocity exceeded"
    },
    {
      "code": 6003,
      "name": "transactionCountVelocityExceeded",
      "msg": "Transaction count velocity exceeded"
    },
    {
      "code": 6004,
      "name": "policyEngineFull",
      "msg": "Policy registry is full, cannot add more policies"
    },
    {
      "code": 6005,
      "name": "policyNotFound",
      "msg": "Policy not found"
    },
    {
      "code": 6006,
      "name": "identityFilterFailed",
      "msg": "Identity filter failed"
    },
    {
      "code": 6007,
      "name": "unauthorizedSigner",
      "msg": "Unauthorized signer"
    },
    {
      "code": 6008,
      "name": "policyAlreadyExists",
      "msg": "Policy already exists"
    }
  ],
  "types": [
    {
      "name": "comparisionType",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "or"
          },
          {
            "name": "and"
          }
        ]
      }
    },
    {
      "name": "identityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identityLevels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparisionType",
            "type": {
              "defined": {
                "name": "comparisionType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "policyType",
            "type": {
              "defined": {
                "name": "policyType"
              }
            }
          },
          {
            "name": "identityFilter",
            "type": {
              "defined": {
                "name": "identityFilter"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policyEngine",
            "docs": [
              "Engine account that the policy belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "policies",
            "docs": [
              "Different policies that can be applied to the policy account"
            ],
            "type": {
              "vec": {
                "defined": {
                  "name": "policy"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyEngineAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version"
            ],
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "authority",
            "docs": [
              "authority of the registry"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "docs": [
              "policy delegate"
            ],
            "type": "pubkey"
          },
          {
            "name": "maxTimeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "policyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "identityApproval"
          },
          {
            "name": "transactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "transactionAmountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "transactionCountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          }
        ]
      }
    }
  ]
};
